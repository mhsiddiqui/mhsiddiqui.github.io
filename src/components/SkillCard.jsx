import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

export default function SkillCard({ skill, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.02, 0.3),
        ease: 'easeOut',
      }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 text-center transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/60"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-teal-50/0 opacity-0 transition-opacity duration-300 group-hover:from-emerald-50/60 group-hover:via-white group-hover:to-teal-50/60 group-hover:opacity-100" />

      <div className="relative">
        <div
          className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
          aria-hidden
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 ring-1 ring-emerald-100 transition-all duration-300 group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:ring-emerald-400 group-hover:ring-offset-2 group-hover:ring-offset-white">
          <Icon
            icon={`simple-icons:${skill.icon}`}
            className="h-7 w-7 text-emerald-700 transition-colors duration-300 group-hover:text-white"
          />
        </div>
      </div>

      <span className="text-sm font-medium text-neutral-800 transition-colors duration-300 group-hover:text-emerald-700">
        {skill.name}
      </span>
    </motion.div>
  )
}
