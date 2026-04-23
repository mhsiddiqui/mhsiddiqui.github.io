import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Section from './Section'
import { formatDuration } from '../lib/date'

export default function Education({ education }) {
  return (
    <Section id="education" title="Education">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {education.map((e, i) => (
          <motion.div
            key={`${e.institution}-${e.start}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -3 }}
            className="group flex gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Icon icon="mdi:school-outline" className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral-900">{e.degree}</h3>
              <p className="mt-0.5 text-sm font-medium text-indigo-600">
                {e.institution}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {formatDuration(e.start, e.end)}
                {e.location && ` · ${e.location}`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
