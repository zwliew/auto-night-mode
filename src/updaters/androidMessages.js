const DAY = "0";
const NIGHT = "1";
const COOKIE_NAME = "bw_theme_dark";
const COOKIE_URL = "https://messages.android.com";

const setCookie = value =>
  chrome.cookies.set({
    value,
    url: COOKIE_URL,
    name: COOKIE_NAME
  });

function update(mode) {
  if (mode !== DAY && mode !== NIGHT) {
    console.error("Invalid mode for Android Messages.");
    return;
  }
  setCookie(mode);
}

export default {
  update,
  DAY,
  NIGHT
};
