import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-gradient md:text-xl">
          {project.name}
        </h3>
        <div className="flex gap-2 text-neutral-400">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              aria-label="Live demo"
              className="transition hover:text-indigo-600"
            >
              <Icon icon="mdi:open-in-new" className="h-5 w-5" />
            </a>
          )}
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              aria-label="Repository"
              className="transition hover:text-indigo-600"
            >
              <Icon icon="mdi:github" className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-neutral-600">{project.description}</p>
      {project.tech?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-md bg-gradient-to-br from-indigo-50 to-purple-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
        {project.contributions.map((c, i) => (
          <li key={i} className="flex gap-2.5">
            <span
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500"
              aria-hidden
            />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  )
}
