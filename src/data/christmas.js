// Christmas mode runs for the whole of December.
export function isChristmasMode(now = new Date()) {
  return now.getMonth() === 11
}
