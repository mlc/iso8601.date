"use strict";

import './style.css';

var toIso = function(d) {
  var pad = function(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  };
  return d.getUTCFullYear() +
  '-' + pad(d.getUTCMonth() + 1) +
  '-' + pad(d.getUTCDate()) +
  'T' + pad(d.getUTCHours()) +
  ':' + pad(d.getUTCMinutes()) +
  ':' + pad(d.getUTCSeconds()) +
  'Z';
}
var date = document.getElementById('date');
var f = function() {
  date.textContent = toIso(new Date());
};
f();
window.setInterval(f, 1000);
