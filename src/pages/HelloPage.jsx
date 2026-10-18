import { LINKS } from '../data/links'

export default function HelloPage() {
  return (
    <section className="panel">
      <h1>Hello!</h1>
      <p>
        You've been redirected here because you attempted to access 
        'hello.harrybromley.com' or 'hello.bromley.sh'. 
      </p>
      <div className="home-recs lost-list">
        <p>
          Below are some links to my various sites/socials, which you may find 
          interesting:
        </p>
        <ul>
          {LINKS.map(({ name, url }) => (
            <li key={name}>
              <span className="rec-name">{name}</span>
              <span className="rec-sep" aria-hidden="true" />
              <span className="rec-comment">
                <a className="lost-link" href={url}>
                  {url.replace(/^https?:\/\//, '')}
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}