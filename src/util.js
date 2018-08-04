export function isNight() {
  const date = new Date()
  const hours = date.getHours()
  return hours < 7 || hours >= 19
}
