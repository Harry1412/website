function SadRobotHead() {
  return (
    <svg
      className="sad-robot"
      viewBox="0 0 100 100"
      width="44"
      height="44"
      role="img"
      aria-label="a sad robot head"
    >
      {/* antenna */}
      <line x1="50" y1="20" x2="50" y2="6" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="5" r="5" fill="currentColor" />

      {/* head */}
      <rect
        x="12"
        y="20"
        width="76"
        height="70"
        rx="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
      />

      {/* sad eyes */}
      <path d="M32 48h12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M56 48h12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />

      {/* frown */}
      <path
        d="M36 72c8-8 20-8 28 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function NotFoundPage({ onHome, homeRef }) {
  return (
    <section className="panel">
      <div className="title-row">
        <h1>Not Found</h1>
        <SadRobotHead />
      </div>
      <p>
        The page you were looking for doesn't exist. It may have been moved,
        renamed, or never existed in the first place.
      </p>
      <button className="home-button" ref={homeRef} onClick={onHome}>
        Return Home
      </button>
    </section>
  )
}