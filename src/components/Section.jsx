import { motion } from 'framer-motion'

export default function Section({
  id,
  title,
  eyebrow,
  children,
  className = '',
  containerClassName = '',
}) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      <div className={`mx-auto max-w-7xl px-6 ${containerClassName}`}>
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            {eyebrow && (
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
                {eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              <span className="text-gradient">{title}</span>
            </h2>
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
