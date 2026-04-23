import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'
import Section from './Section'

const LANG_COLORS = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
}

function extractUsername(githubUrl) {
  try {
    return new URL(githubUrl).pathname.replace(/^\/|\/$/g, '')
  } catch {
    return null
  }
}

function RepoCard({ repo, index }) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
          <Icon icon="mdi:source-branch" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-neutral-900 transition-colors group-hover:text-emerald-600">
            {repo.name}
          </h3>
          {repo.description && (
            <p className="mt-1 text-sm text-neutral-600">{repo.description}</p>
          )}
        </div>
        <Icon
          icon="mdi:arrow-top-right"
          className="h-5 w-5 shrink-0 text-neutral-400 transition-colors group-hover:text-emerald-600"
        />
      </div>
      {(repo.language || repo.stargazers_count > 0 || repo.forks_count > 0) && (
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: LANG_COLORS[repo.language] || '#888' }}
                aria-hidden
              />
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-1">
              <Icon icon="mdi:star-outline" className="h-3.5 w-3.5" />
              {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-1">
              <Icon icon="mdi:source-fork" className="h-3.5 w-3.5" />
              {repo.forks_count}
            </span>
          )}
        </div>
      )}
    </motion.a>
  )
}

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100"
        />
      ))}
    </div>
  )
}

export default function OpenSource({ repos: slugs, githubUrl }) {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const username = extractUsername(githubUrl)
    if (!username || !slugs?.length) {
      setFailed(true)
      return
    }

    const ctrl = new AbortController()
    Promise.allSettled(
      slugs.map((slug) =>
        fetch(`https://api.github.com/repos/${username}/${slug}`, {
          signal: ctrl.signal,
        }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      ),
    )
      .then((results) => {
        const ok = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value)
          .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        setData(ok)
        if (ok.length === 0) setFailed(true)
      })
      .catch(() => setFailed(true))

    return () => ctrl.abort()
  }, [githubUrl, slugs])

  return (
    <Section
      id="open-source"
      title="Open Source"
      className="bg-gradient-to-b from-white via-green-50/30 to-white"
    >
      {data === null && !failed ? (
        <SkeletonGrid count={slugs?.length || 6} />
      ) : !data?.length ? (
        <p className="text-neutral-600">Couldn't load repositories right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((repo, i) => (
            <RepoCard key={repo.id} repo={repo} index={i} />
          ))}
        </div>
      )}
    </Section>
  )
}
