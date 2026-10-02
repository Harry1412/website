export default function HomePage() {
  return (
    <section className="panel">
      <h1>Harry Bromley</h1>
      <p>
        Hello, welcome to my website, feel free to explore! The robot will move 
        around as you click to navigate. In the top right corner, you can also
        speed up or disable the robot altogether.
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
          mountaineer from a young age. I also enjoy skiing, although it can be
          difficult to find the time while living in the UK, and I'm a keen but 
          relatively inexperienced badminton player.
        </p>
      </div>
    </section>
  )
}