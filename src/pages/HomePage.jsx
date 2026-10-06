const RECOMMENDATIONS = [
  {
    name: 'Mr. Robot',
    comment: 'Dark hacker show. 10/10, my favourite piece of TV.',
  },
  {
    name: 'Community',
    comment:
      'Incredibly meta sitcom, with a huge range of funny and inventive episodes.',
  },
  {
    name: 'Foundation (TV + books)',
    comment:
      'Fascinating science fiction universe. The show looks great and brings a unique spin to the story.',
  },
  {
    name: 'Freeride World Tour',
    comment:
      'Skiing down cliffs, usually with a few backflips, very fun to watch.',
  },
  {
    name: 'Cyberpunk 2077',
    comment:
      'Visually excellent with a compelling story and world. Even better with Phantom Liberty.',
  },
  {
    name: 'Kerbal Space Program',
    comment: 'Taught me everything I know about orbital mechanics.',
  },
]

export default function HomePage() {
  return (
    <section className="panel">
      <h1>Harry Bromley</h1>
      <p>
        Hello, welcome to my website, feel free to explore! Enable the robot in
        the top right for a guided experience.
      </p>
      <div className="home-about">
        <h2>About me</h2>
        <p>
          I'm a physicist working on fault-tolerant photonic quantum
          computers. My focus is primarily on the software side of quantum,
          but I've also had exposure to the hardware itself ( though I like
          to avoid the lab as much as possible :) ).
        </p>
        <p>
          Outside work, I have a general appreciation for the outdoors, being a
          mountaineer from a young age. I also enjoy skiing (though this is tricky while living in the UK) and I am a keen but 
          fairly amateur badminton player.
        </p>
      </div>
      <div className="home-recs">
        <h2>Recommendations</h2>
        <p>
          Some things I've enjoyed.
        </p>
        <ul>
          {RECOMMENDATIONS.map(({ name, comment }) => (
            <li key={name}>
              <span className="rec-name">{name}</span>
              <span className="rec-sep" aria-hidden="true" />
              <span className="rec-comment">{comment}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}