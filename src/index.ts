import { Temporal } from 'temporal-polyfill';
import NavigatorLanguagesParser from 'navigator-languages-parser';

import backwards from './backwards';
import { paris, now as republicanNow } from './republican';
import { difference, timeToNs } from './util';
import l10n from './l10n.json';
import './style.css';

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

const localize = () => {
  const zoneUtcAbbr = document.getElementById('zone-utc-abbr') as HTMLElement;
  const ghLink = document.getElementById('gh-link') as HTMLAnchorElement;

  const lang = NavigatorLanguagesParser.parseLanguages(
    Object.keys(l10n),
    'en'
  ) as keyof typeof l10n;
  const strings = l10n[lang];

  zoneUtcAbbr.title = strings.utc;
  if ('gh' in strings) {
    ghLink.title = strings.gh;
  }
  document.body.lang = lang;
};

const setup = () => {
  let tz: Temporal.TimeZoneLike = 'UTC';
  let beats: boolean = false;
  let republican: boolean = false;
  let intervalId: number | undefined;

  localize();

  const date = document.getElementById('date') as HTMLDivElement;

  const padBeats = (beatStr: string): string => {
    switch (beatStr.length) {
      case 4:
        return `00${beatStr}`;
      case 5:
        return `0${beatStr}`;
      default:
        return beatStr;
    }
  };

  const updateDisplay = (): void => {
    let dateStr: string;
    let timeStr: string | null = null;
    if (beats) {
      const beatsNow = timeToNs(Temporal.Now.plainTimeISO(tz)) / 86400000000;
      const beatStr = beatsNow.toFixed(2);
      dateStr = `@${padBeats(beatStr)}`;
    } else if (republican) {
      [dateStr, timeStr] = republicanNow();
    } else {
      dateStr = Temporal.Now.instant().toString({
        timeZone: tz,
        smallestUnit: 'seconds',
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

  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localSetting = document.getElementById(
    'setting-local'
  ) as HTMLLIElement;
  localSetting.getElementsByTagName('label')[0].textContent = localZone;

  const zoneNames = difference(
    Intl.supportedValuesOf('timeZone'),
    backwards,
    extraBackwards
  ).sort((a, b) => a.localeCompare(b));
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
    if (intervalId !== undefined) {
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
      tz = 'UTC';
      beats = false;
      republican = false;
    } else if (value === 'local') {
      tz = localZone;
      beats = false;
      republican = false;
    } else if (value === 'custom') {
      tz = formElements['custom-zone'].value;
      beats = false;
      republican = false;
    } else if (value === 'beats') {
      tz = 'Etc/GMT+1';
      beats = true;
      republican = false;
    } else if (value === 'republican') {
      tz = paris;
      beats = false;
      republican = true;
    }
    if ((beats || republican) !== old864 || intervalId === undefined) {
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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((registrationError) => {
        // eslint-disable-next-line no-console
        console.warn('SW registration failed: ', registrationError);
      });
  });
}
