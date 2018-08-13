import {
  isNight,
  msecToMin,
  minToMsec,
  getNightRange,
  minTilNextMode,
  getNightDuration
} from "./util.js";
import { ALARM } from "./constants.js";

async function resetMode(modeEl) {
  if (await isNight()) {
    modeEl.textContent = "night";
    for (let name in updaters) {
      const updater = updaters[name];
      updater.update(updater.NIGHT);
    }
  } else {
    modeEl.textContent = "day";
    for (let name in updaters) {
      const updater = updaters[name];
      updater.update(updater.DAY);
    }
  }
  chrome.alarms.clear(ALARM, async wasCleared => {
    if (wasCleared) {
      const delay = await minTilNextMode();
      const period = await getNightDuration();
      chrome.alarms.create(ALARM, {
        delayInMinutes: delay,
        periodInMinutes: period
      });
    }
  });
}

window.addEventListener("load", async () => {
  const modeEl = document.getElementById("mode");
  const startEl = document.getElementById("start");
  const endEl = document.getElementById("end");
  modeEl.textContent = (await isNight()) ? "night" : "day";
  const range = await getNightRange();
  startEl.valueAsNumber = minToMsec(range[0]);
  endEl.valueAsNumber = minToMsec(range[1]);

  startEl.addEventListener("input", () => {
    chrome.storage.sync.set({ start: msecToMin(start.valueAsNumber) }, () => {
      resetMode(modeEl);
    });
  });
  endEl.addEventListener("input", () => {
    chrome.storage.sync.set({ end: msecToMin(end.valueAsNumber) }, () => {
      resetMode(modeEl);
    });
  });
});
