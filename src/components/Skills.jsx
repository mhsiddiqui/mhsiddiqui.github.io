import Section from './Section'
import SkillCard from './SkillCard'

export default function Skills({ skills }) {
  return (
    <Section
      id="skills"
      title="Skills"
      className="bg-gradient-to-b from-white via-indigo-50/30 to-white"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {skills.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} index={i} />
        ))}
      </div>
    </Section>
  )
}
