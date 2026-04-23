import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Section from './Section'

export default function Publications({ publications }) {
  return (
    <Section id="publications" title="Publications">
      <div className="space-y-4">
        {publications.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Icon icon="mdi:file-document-outline" className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-neutral-900">{p.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{p.authors}</p>
              <p className="mt-2 text-sm text-neutral-500">
                <span className="font-medium text-indigo-600">{p.venue}</span>
                {p.volume && ` ${p.volume}`}
                {p.year && ` (${p.year})`}
                {p.page && `, p. ${p.page}`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
