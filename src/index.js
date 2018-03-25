"use strict";

import { use as jsJodaUse, ChronoUnit, ZonedDateTime, ZoneId } from 'js-joda';
import jsJodaTimezone from 'js-joda-timezone';
import './style.css';

jsJodaUse(jsJodaTimezone);
const { SECONDS } = ChronoUnit;

let tz = ZoneId.UTC;

const date = document.getElementById('date');

const f = () => {
  date.textContent = ZonedDateTime.now(tz).truncatedTo(SECONDS).toString();
};

f();
window.setInterval(f, 1000);
