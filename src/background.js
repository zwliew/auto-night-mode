import { isNight, minTilNextMode, getNightDuration } from "./util.js";
import { ALARM, DAY, NIGHT, COOKIE_NAME, COOKIE_URL } from "./constants.js";

init();

async function init() {
  updateMode((await isNight()) ? NIGHT : DAY);
  const delay = await minTilNextMode();
  const period = await getNightDuration();
  chrome.alarms.create(ALARM, {
    delayInMinutes: delay,
    periodInMinutes: period
  });
}

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  if (name === ALARM) {
    updateMode((await isNight()) ? NIGHT : DAY);
  }
});

function updateMode(mode) {
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
