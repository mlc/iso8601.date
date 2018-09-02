'use strict';

import {
  ChronoUnit,
  LocalTime,
  ZonedDateTime,
  ZoneId,
  ZoneOffset,
} from 'js-joda';
import 'js-joda-timezone';
import difference from 'lodash.difference';
import isUndefined from 'lodash.isundefined';

import backwards from './backwards';
import { paris, now as republicanNow } from './republican';
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

const setup = () => {
  let tz = ZoneId.UTC;
  let beats = false;
  let republican = false;
  let intervalId;

  const date = document.getElementById('date');

  const updateDisplay = () => {
    let time;
    if (beats) {
      const beats = LocalTime.now(tz).toNanoOfDay() / 86400000000;
      const beatStr = beats.toFixed(2);
      const zeroes =
        beatStr.length === 4 ? '00' : beatStr.length === 5 ? '0' : '';
      time = `@${zeroes}${beatStr}`;
    } else if (republican) {
      time = republicanNow().join('<br>');
    } else {
      time = ZonedDateTime.now(tz)
        .truncatedTo(ChronoUnit.SECONDS)
        .withFixedOffsetZone()
        .toString();
    }
    if (republican) {
      date.innerHTML = time;
    } else {
      date.textContent = time;
    }
  };

  const localZone = ZoneId.systemDefault();
  const localSetting = document.getElementById('setting-local');
  if (localZone && localZone.id() !== 'SYSTEM') {
    localSetting.getElementsByTagName('label')[0].textContent = localZone.id();
  } else {
    localSetting.parentNode.removeChild(localSetting);
  }

  const zoneNames = difference(
    ZoneId.getAvailableZoneIds(),
    backwards,
    extraBackwards
  ).sort((a, b) => a.localeCompare(b));
  const customZoneSelector = document.getElementById('custom-zone-selector');
  zoneNames.forEach(zone => {
    const elt = document.createElement('option');
    elt.textContent = zone;
    elt.setAttribute('value', zone);
    customZoneSelector.appendChild(elt);
  });

  const startInterval = ms => {
    if (!isUndefined(intervalId)) {
      window.clearInterval(intervalId);
    }
    intervalId = window.setInterval(updateDisplay, ms);
  };

  const formElements = document.getElementById('settings-wrapper');
  const updateZone = () => {
    const value = formElements['zone'].value;
    const old864 = beats || republican;

    if (value === 'UTC') {
      tz = ZoneId.UTC;
      beats = false;
      republican = false;
    } else if (value === 'local') {
      tz = localZone;
      beats = false;
      republican = false;
    } else if (value === 'custom') {
      tz = ZoneId.of(formElements['custom-zone'].value);
      beats = false;
      republican = false;
    } else if (value === 'beats') {
      tz = ZoneOffset.ofHours(1);
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
    formElements['zone'].value = 'custom';
    updateZone();
  });

  [...document.querySelectorAll(".setting-zone input[type='radio']")].forEach(
    elt => elt.addEventListener('change', updateZone)
  );

  updateZone();
};

if (
  document.attachEvent
    ? document.readyState === 'complete'
    : document.readyState !== 'loading'
) {
  setup();
} else {
  document.addEventListener('DOMContentLoaded', setup);
}
