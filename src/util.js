import { COOKIE_URL, COOKIE_NAME } from './constants.js';

export function timeInMin() {
  const date = new Date();
  return date.getHours() * 60 + date.getMinutes();
}

export async function isNight() {
  const min = timeInMin();
  const [start, end] = await getNightRange();
  if (start < end) {
    return min >= start && min < end;
  } else {
    return min >= start || min < end;
  }
}

export function getNightRange() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({ start: 1140, end: 420 }, result => {
      if (result === undefined) {
        reject("Failed to get start and end times.");
      } else {
        resolve([result.start, result.end]);
      }
    });
  });
}

export async function minTilNextMode() {
  const night = await isNight();
  const [start, end] = await getNightRange();
  const min = timeInMin();
  if (night) {
    return min <= end ? end - min : 1440 - min + end;
  } else {
    return min <= start ? start - min : 1440 - min + start;
  }
}

export async function getNightDuration() {
  const [start, end] = await getNightRange();
  return start < end ? end - start : 1440 - start + end;
}

export function msecToMin(msec) {
  return msec / 1000 / 60;
}

export function minToMsec(min) {
  return min * 60 * 1000;
}

export function updateMode(mode) {
  chrome.cookies.get(
    {
      url: COOKIE_URL,
      name: COOKIE_NAME
    },
    cookie => {
      let result = `f6=${mode}`;
      if (cookie === null) {
        setCookie(cookie, result);
        return;
      }

      const { value } = cookie;
      if (value.length === 0) {
        setCookie(cookie, result);
        return;
      }

      const startIndex = value.indexOf("f6=");
      if (startIndex === -1) {
        result = `${value}&f6=${mode}`;
        setCookie(cookie, result);
        return;
      }

      const startStr = value.substring(0, startIndex);
      const endIndex = value.indexOf("&", startIndex + 1);
      if (endIndex === -1) {
        result = `${startStr}f6=${mode}`;
        setCookie(cookie, result);
        return;
      }

      const endStr = value.substring(endIndex);
      result = `${startStr}f6=${mode}${endStr}`;
      setCookie(cookie, result);
    }
  );
}

function setCookie(cookie, value) {
  let expirationDate;
  if (cookie === null) {
    expirationDate = Date.now() + 63071623;
  } else {
    expirationDate = cookie.expirationDate;
  }
  chrome.cookies.set({
    url: COOKIE_URL,
    domain: ".youtube.com",
    expirationDate,
    name: COOKIE_NAME,
    value
  });
}
