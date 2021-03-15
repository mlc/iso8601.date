import { Temporal } from 'proposal-temporal';
import difference from 'lodash/difference';
import isUndefined from 'lodash/isUndefined';

import backwards from './backwards';
import { paris, now as republicanNow } from './republican';
import './style.css';
import tzs from './tzs.json';
import { haveTz, nanoOfDay, padBeats } from './utils';

const extraBackwards = [
  'US/Pacific-New',
  'WET',
  'CET',
  'MET',
  'EET',
  'EST',
  'MST',
  'HST',
  'EST5EDT',
  'CST6CDT',
  'MST7MDT',
  'PST8PDT',
];

const setup = () => {
  let tz: Temporal.TimeZone = Temporal.TimeZone.from('UTC');
  let beats: boolean = false;
  let republican: boolean = false;
  let intervalId: number | undefined;

  const date = document.getElementById('date') as HTMLDivElement;

  const updateDisplay = (): void => {
    let dateStr: string;
    let timeStr: string | null = null;
    if (beats) {
      const beatsNow = nanoOfDay(Temporal.now.plainTimeISO(tz)) / 86400000000;
      const beatStr = beatsNow.toFixed(2);
      dateStr = `@${padBeats(beatStr)}`;
    } else if (republican) {
      [dateStr, timeStr] = republicanNow();
    } else {
      dateStr = Temporal.now.zonedDateTimeISO(tz).toString({
        smallestUnit: 'second',
        timeZoneName: 'never',
        calendarName: 'never',
      });
    }
    if (timeStr) {
      const nodes = date.childNodes;
      if (nodes.length === 3) {
        nodes[0].textContent = dateStr;
        nodes[2].textContent = timeStr;
      } else {
        nodes.forEach((node) => node.remove());
        date.append(
          document.createTextNode(dateStr),
          document.createElement('br'),
          document.createTextNode(timeStr)
        );
      }
    } else {
      date.textContent = dateStr;
    }
  };

  const localZone = Temporal.now.timeZone();
  const localSetting = document.getElementById(
    'setting-local'
  ) as HTMLLIElement;
  if (localZone && localZone.id !== 'SYSTEM') {
    localSetting.getElementsByTagName('label')[0].textContent = localZone.id;
  } else {
    localSetting.parentNode?.removeChild(localSetting);
  }

  const zoneNames = difference(tzs as string[], backwards, extraBackwards)
    .filter(haveTz)
    .sort((a, b) => a.localeCompare(b));
  const customZoneSelector = document.getElementById(
    'custom-zone-selector'
  ) as HTMLSelectElement;
  zoneNames.forEach((zone) => {
    const elt = document.createElement('option');
    elt.textContent = zone;
    elt.setAttribute('value', zone);
    customZoneSelector.appendChild(elt);
  });

  const startInterval = (ms: number) => {
    if (!isUndefined(intervalId)) {
      window.clearInterval(intervalId);
    }
    intervalId = window.setInterval(updateDisplay, ms);
  };

  const formElements = document.getElementById(
    'settings-wrapper'
  ) as HTMLFormElement;
  const updateZone = () => {
    const { value } = formElements.zone;
    const old864 = beats || republican;

    if (value === 'UTC') {
      tz = Temporal.TimeZone.from('UTC');
      beats = false;
      republican = false;
    } else if (value === 'local') {
      tz = localZone;
      beats = false;
      republican = false;
    } else if (value === 'custom') {
      tz = Temporal.TimeZone.from(formElements['custom-zone'].value);
      beats = false;
      republican = false;
    } else if (value === 'beats') {
      tz = Temporal.TimeZone.from('+01:00');
      beats = true;
      republican = false;
    } else if (value === 'republican') {
      tz = paris;
      beats = false;
      republican = true;
    }
    if ((beats || republican) !== old864 || isUndefined(intervalId)) {
      startInterval(beats || republican ? 864 : 1000);
    }
    if (beats) {
      document.body.classList.add('beats');
    } else {
      document.body.classList.remove('beats');
    }
    updateDisplay();
  };

  customZoneSelector.addEventListener('change', () => {
    formElements.zone.value = 'custom';
    updateZone();
  });

  document
    .querySelectorAll<HTMLInputElement>("#settings input[type='radio']")
    .forEach((elt) => elt.addEventListener('change', updateZone));

  updateZone();
};

if (/^loaded|^i|^c/.test(document.readyState)) {
  setup();
} else {
  const onReady = () => {
    setup();
    document.removeEventListener('DOMContentLoaded', onReady);
  };
  document.addEventListener('DOMContentLoaded', onReady);
}
