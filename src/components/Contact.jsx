import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

export default function Contact({ contact }) {
  const links = [
    {
      icon: 'mdi:email-outline',
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: 'mdi:phone-outline',
      label: 'Phone',
      value: contact.mobile,
      href: `tel:${contact.mobile.replace(/\s/g, '')}`,
    },
    {
      icon: 'mdi:github',
      label: 'GitHub',
      value: contact.github.replace('https://', ''),
      href: contact.github,
    },
    {
      icon: 'mdi:linkedin',
      label: 'LinkedIn',
      value: contact.linkedin.replace('https://', ''),
      href: contact.linkedin,
    },
    {
      icon: 'mdi:stack-overflow',
      label: 'Stack Overflow',
      value: contact.stackoverflow.replace('https://', ''),
      href: contact.stackoverflow,
    },
    {
      icon: 'mdi:web',
      label: 'Website',
      value: contact.website.replace('https://', ''),
      href: contact.website,
    },
  ]

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-3xl"
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-white/80">
            Contact
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Let's build something together.
          </h2>
          <p className="text-lg text-white/80">
            Always open to new projects, collaborations, and interesting
            problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l, i) => (
            <motion.a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Icon icon={l.icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                  {l.label}
                </p>
                <p className="truncate text-sm font-medium">{l.value}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
