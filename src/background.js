import {
  isNight,
  minTilNextMode,
  getNightDuration,
  changeMode
} from "./util.js";
import { ALARM } from "./constants.js";

chrome.runtime.onInstalled.addListener(async () => {
  changeMode(await isNight());

  const delay = await minTilNextMode();
  const period = await getNightDuration();
  chrome.alarms.create(ALARM, {
    delayInMinutes: delay,
    periodInMinutes: period
  });
});

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  if (name === ALARM) {
    changeMode(await isNight());
  }
});
