import { isNight } from './util.js'

window.addEventListener('load', () => {
  const mode = document.getElementById('mode')
  mode.textContent = isNight() ? 'night' : 'day'
})