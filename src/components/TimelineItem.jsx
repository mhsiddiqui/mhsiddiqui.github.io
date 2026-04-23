import { motion } from 'framer-motion'
import { formatDuration } from '../lib/date'

export default function TimelineItem({ item, isLast, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative pb-12 pl-12 last:pb-0"
    >
      {!isLast && (
        <div
          className="absolute left-[11px] top-6 h-full w-0.5 bg-gradient-to-b from-emerald-300 via-teal-300 to-green-200"
          aria-hidden
        />
      )}
      <div
        className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 ring-4 ring-white"
        aria-hidden
      >
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-lg font-semibold text-neutral-900 md:text-xl">
            {item.role}
          </h3>
          <span className="text-neutral-300">·</span>
          <span className="font-medium text-gradient">{item.company}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">
          {formatDuration(item.start, item.end)}
          {item.location && ` · ${item.location}`}
        </p>
        <ul className="mt-4 space-y-2 text-neutral-700">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500"
                aria-hidden
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
