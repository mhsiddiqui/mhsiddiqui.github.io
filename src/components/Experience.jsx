import Section from './Section'
import TimelineItem from './TimelineItem'

export default function Experience({ experience }) {
  return (
    <Section id="experience" title="Experience">
      <div className="relative">
        {experience.map((item, i) => (
          <TimelineItem
            key={`${item.company}-${item.start}`}
            item={item}
            index={i}
            isLast={i === experience.length - 1}
          />
        ))}
      </div>
    </Section>
  )
}
