const EXPERIENCES = [
  {
    title: 'Your Job Title — Company',
    description: 'A short description of what you did in this role.',
  },
  {
    title: 'Another Role — Somewhere',
    description: 'A short description of this experience too.',
  },
  {
    title: 'Your Degree — University',
    description: 'A short description of what you studied.',
  },
]

export default function AboutPage() {
  return (
    <section className="panel">
      <h1>About</h1>
      <p>
        A little about me… placeholder copy for now. The robot is unpacking
        somewhere new, so make yourself at home.
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
    </section>
  )
}