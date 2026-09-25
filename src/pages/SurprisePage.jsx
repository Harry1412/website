import { useState } from 'react'

const VALID_ANSWERS = new Set(['robot', 'a robot'])

export default function SurprisePage({ solved, onSolve }) {
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (VALID_ANSWERS.has(value.trim().toLowerCase())) {
      setWrong(false)
      onSolve()
    } else {
      setWrong(true)
    }
  }

  return (
    <section className="panel surprise">
      <h1>{solved ? 'Correct' : "Don't answer this riddle"}</h1>
      {solved ? (
        <p className="riddle-solved">The dance floor is unlocked, have fun!</p>
      ) : (
        <>
          <p className="riddle">
            People say I have a heart but I'm hollow inside, I'm built from a
            hundred little parts and not one of them has a mind — what am I?
          </p>
          <form className="riddle-form" onSubmit={handleSubmit}>
            <input
              className="riddle-input"
              type="text"
              value={value}
              placeholder="Type your answer"
              autoFocus
              onChange={(e) => {
                setValue(e.target.value)
                setWrong(false)
              }}
            />
            <button className="riddle-submit" type="submit">
              Unlock
            </button>
          </form>
          {wrong && <p className="riddle-feedback">Not quite — try again.</p>}
        </>
      )}
    </section>
  )
}