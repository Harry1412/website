const EXPERIENCES = [
  {
    title: 'Aegiq • Various Roles',
    description: `TODO: Add description (may split into multiple roles.)`,
  },
  {
    title: 'University of St. Andrews • Theoretical Physics (MPhys)',
      description: `TODO: Add key modules & final year project.`,
  },
]

const SKILLS_INTRO = `Below are some skills & tools that I have varying degrees
  of competency in.`

const SKILLS = [
  'Python',
  'Git',
  'Git{Hub,Lab} & CI/CD',
  'Rust',
  'Julia',
]

export default function CVPage() {
  return (
    <section className="panel">
      <h1>CV</h1>
      <p>
        Short introductory statement.
      </p>
      <div className="timeline">
        {EXPERIENCES.map((exp) => (
          <div className="timeline-item" key={exp.title}>
            <span className="timeline-marker" />
            <div className="timeline-content">
              <h3>{exp.title}</h3>
              <p>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="skills">
        <h2>Skills | Tools</h2>
        {SKILLS_INTRO && <p className="skills-intro">{SKILLS_INTRO}</p>}
        <ul className="skill-list">
          {SKILLS.map((skill) => (
            <li key={skill} className="skill-tag">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}