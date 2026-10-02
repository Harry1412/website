const EXPERIENCES = [
  {
    title: '2024 • Aegiq • Quantum Software Engineer',
    description: (
      <>
        Architected Aegiq's software stack for its first generation quantum
        computing system. Built various aspects including the{' '}
        <a
          href="https://github.com/Aegiq/lightworks"
          target="_blank"
          rel="noreferrer noopener"
        >
          Lightworks
        </a>{' '}
        SDK, and a custom compiler. Implemented code for tomography, and
        improved system performance through AI-assisted calibration.
      </>
    ),
  },
  {
    title: '2021 • Aegiq • Various Roles',
    description: `Built a component library for Aegiq's single photon sources,
      later expanded responsibility to include aspects of quantum computing 
      theory and near term application development.`,
  },
  {
    title: '2017 • University of St. Andrews • Theoretical Physics (MPhys)',
      description: `First-Class Honours Degree. Final year project on simulating
        quantum light pulses in nonlinear optical networks.`,
  },
]

const SKILLS_INTRO = `This is a list of skills & tools that I have varying 
  degrees of competency in.`

const SKILLS = [
  'Python',
  'Git',
  'Git{Hub,Lab} & CI/CD',
  'Pytest, ruff & mypy',
  'Quantum computing',
  'Quantum tomography',
  'Rust',
  'Julia',
  'Photonic FDTD Simulation',
]

export default function CVPage() {
  return (
    <section className="panel">
      <h1>CV</h1>
      <p>
        Find a brief snapshot of my professional background below. Dates quoted
        are the start dates for a particular chapter.
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