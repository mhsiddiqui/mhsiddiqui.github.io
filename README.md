# Portfolio - Muhammad Hassan Siddiqui

A modern, responsive portfolio built with React, Tailwind CSS, and Framer Motion. This project is designed to be easily customizable and is automatically deployed to GitHub Pages using GitHub Actions.

## 🚀 Features
- **Flexible Data Source**: Uses local `portfolio.json` by default, with an optional remote fetch (e.g., from a private GitHub Gist).
- **Responsive Design**: Optimized for all screen sizes.
- **Modern Tech Stack**: React 18, Vite, Tailwind CSS (v4), and Framer Motion.
- **SEO Ready**: Includes Meta tags, Open Graph tags, `robots.txt`, and `sitemap.xml`.
- **Automated Deployment**: Zero-config deployment via GitHub Actions.

## 🛠️ Tech Stack
- **Frontend**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Deployment**: [GitHub Actions](https://github.com/features/actions)

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mhsiddiqui/mhsiddiqui.github.io.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### ⚙️ Configuration (Optional)
The site uses the data in `src/data/portfolio.json`. If you want to fetch your CV data from a remote URL (like a private Gist) to update your site without redeploying code:

1. Create a `.env` file based on `.env.example`.
2. Set `VITE_CV_URL` to your raw JSON URL.
3. For production, add `VITE_CV_URL` as a **GitHub Secret** in your repository settings.

### Development
Start the development server:
```bash
npm run dev
```

### Build
Generate a production build in the `dist/` folder:
```bash
npm run build
```

## 🚢 Deployment
Deployment is automated via GitHub Actions.
1. Push your changes to the `portfolio` branch.
2. Ensure your GitHub Repository is set to deploy from Actions:
   - **Settings > Pages > Build and deployment > Source: GitHub Actions**.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
