import { LINKS } from '../data/links'

export default function LostPage() {
  return (
    <section className="panel">
      <h1>Lost?</h1>
      <p>It looks like you may be lost. If you are seeing this page you were 
        likely trying to access an invalid sub-domain of 'harrybromley.com' or
        'bromley.sh'.</p>
      <div className="home-recs lost-list">
        <p>Perhaps you were looking for:</p>
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