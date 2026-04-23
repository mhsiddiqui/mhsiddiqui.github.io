import Section from './Section'
import ProjectCard from './ProjectCard'

export default function Projects({ projects }) {
  return (
    <Section
      id="projects"
      title="Projects"
      className="bg-gradient-to-b from-white via-teal-50/30 to-white"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </Section>
  )
}
