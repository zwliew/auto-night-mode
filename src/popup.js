import {
  isNight,
  msecToMin,
  minToMsec,
  getNightRange,
  minTilNextMode,
  getNightDuration
} from "./util.js";
import { ALARM } from "./constants.js";

function resetAlarm() {
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
  const mode = document.getElementById("mode");
  const start = document.getElementById("start");
  const end = document.getElementById("end");

  mode.textContent = (await isNight()) ? "night" : "day";
  const range = await getNightRange();
  start.valueAsNumber = minToMsec(range[0]);
  end.valueAsNumber = minToMsec(range[1]);

  start.addEventListener("input", () => {
    chrome.storage.sync.set({ start: msecToMin(start.valueAsNumber) }, () => {
      resetAlarm();
    });
  });
  end.addEventListener("input", () => {
    chrome.storage.sync.set({ end: msecToMin(end.valueAsNumber) }, () => {
      resetAlarm();
    });
  });
});
