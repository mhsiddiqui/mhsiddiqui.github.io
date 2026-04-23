import { Icon } from '@iconify/react'
import { motion } from 'framer-motion'

export default function Hero({ personalInfo, contact }) {
  const socials = [
    { icon: 'mdi:email-outline', href: `mailto:${contact.email}`, label: 'Email' },
    { icon: 'mdi:github', href: contact.github, label: 'GitHub' },
    { icon: 'mdi:linkedin', href: contact.linkedin, label: 'LinkedIn' },
    { icon: 'mdi:stack-overflow', href: contact.stackoverflow, label: 'Stack Overflow' },
    { icon: 'mdi:web', href: contact.website, label: 'Website' },
  ]

  return (
    <section id="top" className="relative overflow-hidden -mt-16 pt-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute -left-20 top-20 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="animate-blob-delay absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-400/30 blur-3xl" />
        <div className="animate-blob-delay-2 absolute bottom-10 left-1/3 h-96 w-96 rounded-full bg-pink-400/30 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-24 md:py-36 lg:py-44">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-indigo-700 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {personalInfo.title}
          </motion.span>

          <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-gradient">{personalInfo.name}</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 max-w-2xl text-lg text-neutral-600 md:text-xl"
          >
            {personalInfo.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-sm text-neutral-500"
          >
            <Icon icon="mdi:map-marker-outline" className="h-4 w-4" />
            <span>{personalInfo.location}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-700 shadow-sm backdrop-blur transition-colors hover:border-indigo-400 hover:text-indigo-600"
              >
                <Icon icon={s.icon} className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
