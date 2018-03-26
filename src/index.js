"use strict";

import isUndefined from 'lodash.isundefined';
import { use as jsJodaUse, ChronoUnit, LocalTime, ZonedDateTime, ZoneId, ZoneOffset } from 'js-joda';
import jsJodaTimezone from 'js-joda-timezone';

import './style.css';

jsJodaUse(jsJodaTimezone);
const { SECONDS } = ChronoUnit;

const setup = () => {
  let tz = ZoneId.UTC;
  let beats = false;
  let intervalId;

  const date = document.getElementById('date');

  const updateDisplay = () => {
    let time;
    if (beats) {
      const beats = LocalTime.now(tz).toNanoOfDay() / 86400000000;
      const beatStr = beats.toFixed(2);
      const zeroes = (beatStr.length === 4) ? '00' : (beatStr.length === 5) ? '0' : '';
      time = `@${zeroes}${beatStr}`;
    } else {
      time = ZonedDateTime.now(tz).truncatedTo(SECONDS).withFixedOffsetZone().toString();
    }
    date.textContent = time;
  };

  const localZone = ZoneId.systemDefault();
  const localSetting = document.getElementById('setting-local');
  if (localZone) {
    localSetting.getElementsByTagName('label')[0].textContent = localZone.id();
  } else {
    localSetting.parentNode.removeChild(localSetting);
  }

  const zoneNames = [...ZoneId.getAvailableZoneIds()].sort((a, b) => a.localeCompare(b));
  const customZoneSelector = document.getElementById("custom-zone-selector");
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
  }

  const formElements = document.getElementById("settings-wrapper");
  const updateZone = () => {
    const value = formElements["zone"].value;
    const oldBeats = beats;
    if (value === 'UTC') {
      tz = ZoneId.UTC;
      beats = false;
    } else if (value === 'local') {
      tz = localZone;
      beats = false;
    } else if (value === 'custom') {
      tz = ZoneId.of(formElements["custom-zone"].value);
      beats = false;
    } else if (value === 'beats') {
      tz = ZoneOffset.ofHours(1);
      beats = true;
    }
    if (beats !== oldBeats || isUndefined(intervalId)) {
      startInterval(beats ? 864 : 1000);
    }
    if (beats) {
      document.body.classList.add('beats');
    } else {
      document.body.classList.remove('beats');
    }
    updateDisplay();
  };

  customZoneSelector.addEventListener('change', () => {
    formElements["zone"].value = 'custom';
    updateZone();
  });

  [...document.querySelectorAll(".setting-zone input[type='radio']")].forEach(elt =>
    elt.addEventListener("change", updateZone)
  );

  updateZone();
}

if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
  setup();
} else {
  document.addEventListener('DOMContentLoaded', setup);
}
