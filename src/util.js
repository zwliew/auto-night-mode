export function timeInMin() {
  const date = new Date();
  return date.getHours() * 60 + date.getMinutes();
}

export async function isNight() {
  const min = timeInMin();
  const { start, end } = await getNightRange();
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
