import { setCookie } from "../util.js";

const DAY = "0";
const NIGHT = "1";
const COOKIE_DOMAIN = "messages.android.com";
const COOKIE_NAME = "bw_theme_dark";
const COOKIE_URL = "https://messages.android.com";

const _setCookie = (val, expirationDate) =>
  setCookie(val, COOKIE_DOMAIN, COOKIE_URL, COOKIE_NAME, expirationDate);

function update(mode) {
  if (mode !== DAY && mode !== NIGHT) {
    console.error("Invalid mode for Android Messages.");
    return;
  }

  chrome.cookies.get(
    {
      url: COOKIE_URL,
      name: COOKIE_NAME
    },
    cookie => {
      if (cookie === null) {
        _setCookie(mode);
        return;
      }
      _setCookie(mode, cookie.expirationDate);
    }
  );
}

export default {
  update,
  DAY,
  NIGHT
};
