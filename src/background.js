import { isNight, minTilNextMode, getNightDuration, updateMode } from "./util.js";
import { ALARM, DAY, NIGHT } from "./constants.js";

chrome.runtime.onInstalled.addListener(async () => {
  updateMode((await isNight()) ? NIGHT : DAY);

  const delay = await minTilNextMode();
  const period = await getNightDuration();
  chrome.alarms.create(ALARM, {
    delayInMinutes: delay,
    periodInMinutes: period
  });
});

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  if (name === ALARM) {
    updateMode((await isNight()) ? NIGHT : DAY);
  }
});
