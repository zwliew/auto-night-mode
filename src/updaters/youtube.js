import { setCookie } from "../util.js";

const DAY = "80010";
const NIGHT = "410";
const COOKIE_NAME = "PREF";
const COOKIE_URL = "https://www.youtube.com";
const COOKIE_DOMAIN = ".youtube.com";

const _setCookie = (val, expirationDate) =>
  setCookie(val, COOKIE_DOMAIN, COOKIE_URL, COOKIE_NAME, expirationDate);

function update(mode) {
  if (mode !== DAY && mode !== NIGHT) {
    console.error("Invalid mode for YouTube");
    return;
  }

  chrome.cookies.get(
    {
      url: COOKIE_URL,
      name: COOKIE_NAME
    },
    cookie => {
      let result = `f6=${mode}`;
      if (cookie === null) {
        _setCookie(result);
        return;
      }

      const { value } = cookie;
      if (value.length === 0) {
        _setCookie(result, cookie.expirationDate);
        return;
      }

      const startIndex = value.indexOf("f6=");
      if (startIndex === -1) {
        result = `${value}&f6=${mode}`;
        _setCookie(result, cookie.expirationDate);
        return;
      }

      const startStr = value.substring(0, startIndex);
      const endIndex = value.indexOf("&", startIndex + 1);
      if (endIndex === -1) {
        result = `${startStr}f6=${mode}`;
        _setCookie(result, cookie.expirationDate);
        return;
      }

      const endStr = value.substring(endIndex);
      result = `${startStr}f6=${mode}${endStr}`;
      _setCookie(result, cookie.expirationDate);
    }
  );
}

export default {
  update,
  DAY,
  NIGHT
};
