import { isNight, minTilNextMode, getNightDuration } from "./util.js";
import { ALARM } from "./constants.js";
import updaters from "./updaters/index.js";

chrome.runtime.onInstalled.addListener(async () => {
  if (await isNight()) {
    for (let name in updaters) {
      const updater = updaters[name];
      updater.update(updater.NIGHT);
    }
  } else {
    for (let name in updaters) {
      const updater = updaters[name];
      updater.update(updater.DAY);
    }
  }

  const delay = await minTilNextMode();
  const period = await getNightDuration();
  chrome.alarms.create(ALARM, {
    delayInMinutes: delay,
    periodInMinutes: period
  });
});

chrome.alarms.onAlarm.addListener(async ({ name }) => {
  if (name === ALARM) {
    if (await isNight()) {
      for (let name in updaters) {
        const updater = updaters[name];
        updater.update(updater.NIGHT);
      }
    } else {
      for (let name in updaters) {
        const updater = updaters[name];
        updater.update(updater.DAY);
      }
    }
  }
});
