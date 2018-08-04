import { isNight } from './util.js'

const DAY = '80010'
const NIGHT = '410'
const COOKIE_NAME = 'PREF'
const COOKIE_URL = 'https://www.youtube.com'

// Initialize extension
const date = new Date()
const hours = date.getHours()
const timeInMin = hours * 60 + date.getMinutes()
let delta
if (isNight()) {
  updateMode(NIGHT)
  delta = hours >= 7 ? 1860 - timeInMin : 420 - timeInMin
} else {
  updateMode(DAY)
  delta = 1140 - timeInMin
}

chrome.alarms.create('setMode', {
  delayInMinutes: delta,
  periodInMinutes: 720
})

chrome.alarms.onAlarm.addListener(() => {
  updateMode(isNight() ? NIGHT : DAY)
})

function updateMode(mode) {
  chrome.cookies.get({
    url: COOKIE_URL,
    name: COOKIE_NAME
  }, (cookie) => {
    let result = `f6=${mode}`
    if (cookie === null) {
      setCookie(cookie, result)
      return
    }

    const { value } = cookie
    if (value.length === 0) {
      setCookie(cookie, result)
      return
    }

    const startIndex = value.indexOf('f6=')
    if (startIndex === -1) {
      result = `${value}&f6=${mode}`
      setCookie(cookie, result)
      return
    }

    const startStr = value.substring(0, startIndex)
    const endIndex = value.indexOf('&', startIndex + 1)
    if (endIndex === -1) {
      result = `${startStr}f6=${mode}`
      setCookie(cookie, result)
      return
    }

    const endStr = value.substring(endIndex)
    result = `${startStr}f6=${mode}${endStr}`
    setCookie(cookie, result)
  })
}

function setCookie(cookie, value) {
  let expirationDate
  if (cookie === null) {
    expirationDate = Date.now() + 63071623
  } else {
    expirationDate = cookie.expirationDate
  }
  chrome.cookies.set({
    url: COOKIE_URL,
    domain: '.youtube.com',
    expirationDate,
    name: COOKIE_NAME,
    value
  })
}
