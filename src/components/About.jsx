import { motion } from 'framer-motion'
import Section from './Section'
import { yearsSince } from '../lib/date'

export default function About({ aboutMe }) {
  const years = yearsSince(aboutMe.from_date)
  const text = aboutMe.text.replace('{years}', years)

  return (
    <Section id="about" title="About">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl text-xl leading-relaxed text-neutral-700 md:text-2xl"
      >
        {text}
      </motion.p>
    </Section>
  )
}
