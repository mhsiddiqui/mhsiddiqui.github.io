import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

export default function SkillCard({ skill, index = 0 }) {
  const pct = (skill.expertise / 10) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.3) }}
      whileHover={{ y: -3 }}
      className="group rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/60"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon
          icon={`simple-icons:${skill.icon}`}
          className="h-5 w-5 shrink-0 text-neutral-700 transition-colors group-hover:text-indigo-600"
        />
        <span className="truncate text-sm font-medium text-neutral-800">
          {skill.name}
        </span>
        <span className="ml-auto font-mono text-xs text-neutral-500">
          {skill.expertise}/10
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        aria-valuenow={skill.expertise}
        aria-valuemin={0}
        aria-valuemax={10}
        aria-label={`${skill.name} expertise`}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, delay: 0.2 + Math.min(index * 0.02, 0.3), ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        />
      </div>
    </motion.div>
  )
}
