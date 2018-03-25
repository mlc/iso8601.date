"use strict";

import { use as jsJodaUse, ChronoUnit, ZonedDateTime, ZoneId } from 'js-joda';
import jsJodaTimezone from 'js-joda-timezone';
import './style.css';

jsJodaUse(jsJodaTimezone);
const { SECONDS } = ChronoUnit;

let tz = ZoneId.UTC;

const date = document.getElementById('date');

const updateDisplay = () => {
  date.textContent = ZonedDateTime.now(tz).truncatedTo(SECONDS).withFixedOffsetZone().toString();
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

const formElements = document.getElementById("settings-wrapper");
const updateZone = () => {
  const value = formElements["zone"].value;
  if (value === 'UTC') {
    tz = ZoneId.UTC;
  } else if (value === 'local') {
    tz = localZone;
  } else if (value === 'custom') {
    tz = ZoneId.of(formElements["custom-zone"].value);
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
updateDisplay();

window.setInterval(updateDisplay, 1000);
