# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server (default http://localhost:5173)
- `npm run build` — production build into `dist/`
- `npm run preview` — serve the built `dist/` to verify a production build locally

No test runner and no linter are configured — don't assume `npm test` or `npm run lint` exist.

## Environment

- `VITE_CV_URL` (optional) — raw URL to a remote `portfolio.json` (typically a GitHub Gist). If unset, the app uses only the bundled `data/portfolio.json`. Configured via `.env` locally and as a GitHub Secret for the deploy workflow.

## Architecture

### Data flow: bundled JSON + optional remote merge

`data/portfolio.json` is the structural source of truth. `src/App.jsx`:

1. Imports the bundled JSON at build time as the **initial React state** — the UI renders instantly without a loading flash.
2. On mount, if `VITE_CV_URL` is set, fetches the remote JSON and merges it over the bundled copy via `mergeWithBundled`:
   - Top-level keys from remote win.
   - Top-level keys whose value is a **plain object** (e.g. `strings`, `personal_info`, `contact`, `about_me`) are shallow-merged one level deep — so if remote omits a sub-key, the bundled value still fills in.
   - Arrays (`skills`, `experience`, `projects`, `education`, `open_source_contributions`, `publications`) are taken wholesale from remote — no array merging.
3. The merged `cv` is passed down as props; no React Context, no external state library.

**Implication:** `data/portfolio.json` is the schema floor. Adding a new field means (a) adding it to `data/portfolio.json` so the UI doesn't crash on fresh remote fetches that don't have it yet, and (b) optionally adding it to the gist. Don't do a plain `setCv(data)` in the fetch handler — that loses the fallback behavior.

Gist edits propagate after a ~5-minute CDN cache on `raw.githubusercontent.com`. Console logs `[CV] …` messages to indicate whether data is from bundle or remote.

### Sections and the `Section` wrapper

Each visible region of the page is a component under `src/components/` (`About`, `Skills`, `Experience`, `Projects`, `Education`, `OpenSource`, `Publications`, `Contact`, plus `Hero` and `Navbar`). They share `Section.jsx` for the outer `<section id="…">` + gradient section-title treatment, so scroll-anchor IDs and spacing stay consistent. Repeating items inside a section have their own inner components (`SkillCard`, `TimelineItem`, `ProjectCard`) — keep that split when adding new sections.

Sections don't fetch their own data. The one exception is `OpenSource`:

### OpenSource section pulls from GitHub live

`portfolio.json` → `open_source_contributions` is a **flat array of GitHub repo slugs** (not objects, not descriptions). `OpenSource.jsx` extracts the username from `contact.github`, then fetches `https://api.github.com/repos/{username}/{slug}` for each slug in parallel via `Promise.allSettled`, sorts results by star count, and renders name/description/language/stars/forks from the live API response. One bad slug doesn't break the rest; if the whole fetch fails or returns nothing, an error placeholder shows. The unauth GitHub API cap is 60 req/hour per IP.

### PDF resume is a parallel render target

`DownloadResumeButton.jsx` does a **dynamic import** of `@react-pdf/renderer` and `ResumeDocument.jsx` only when clicked — the 500 KB react-pdf bundle is code-split out of the main bundle. Expect a noticeable first-click delay while it loads.

`ResumeDocument.jsx` is a **separate layout** built with react-pdf primitives (`<Document>`, `<Page>`, `<View>`, `<Text>`, `<Link>`, `StyleSheet`). It does **not** reuse the web JSX or Tailwind classes. Constraints to remember:
- Only built-in fonts are registered (`Helvetica`, `Helvetica-Bold`, etc.). Don't use `fontStyle: 'italic'` or unregistered fonts.
- Don't use `letterSpacing` on text with `textTransform: 'uppercase'` — react-pdf miscalculates the line box and adjacent text overlaps. This was a real bug in the header.
- Padding/lineHeight behaves differently than CSS — pill text is vertically centered via asymmetric `paddingTop`/`paddingBottom` + `lineHeight: 1` on the text, not `alignItems`.

### Theming

Accent color lives in **two places**:

1. `src/index.css` — three CSS variables `--brand-1/2/3` (and the `.text-gradient` class that uses them). Gradients and the `text-gradient` utility retheme by editing these.
2. Tailwind utility classes (`emerald-*`, `teal-*`, `green-*`) are hardcoded across components for backgrounds, hover states, rings, etc. Changing those requires a project-wide search/replace of class names (sed `s/emerald-/<new>-/g` across `src/`). Tailwind can't pick up dynamically-constructed class names from env vars, so a true env-driven theme isn't wired in.

The PDF has its own `COLORS` object at the top of `ResumeDocument.jsx` — update it separately.

### Skills shape

`skills[]` entries are `{ name, icon }` only — **no `expertise` field**. The field was removed intentionally (skill bars on a senior resume read as amateur). The `icon` is a [Simple Icons](https://simpleicons.org) slug and is rendered via `<Icon icon={`simple-icons:${skill.icon}`} />` (Iconify). Missing Simple Icons can be swapped to another Iconify collection (e.g. `devicon:…`, `logos:…`).

### Dates

`src/lib/date.js` exports `yearsSince(yyyy-mm)`, `formatDate(yyyy-mm | yyyy)`, `formatDuration(start, end)`. In `experience[]`, `end: null` means current role and formats as "Present". The `about_me.text` string contains a `{years}` placeholder that `About.jsx` replaces at render time from `about_me.from_date` — so the years count stays fresh without manual edits.

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages **only on pushes to `main`**. The workflow reads `VITE_CV_URL` from repository secrets. Pushing to any other branch does nothing.
