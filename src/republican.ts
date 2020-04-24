import { Date as Floreal } from 'floreal';
import { LocalDateTime, ZoneOffset } from '@js-joda/core';
import floor from 'lodash/floor';

export const paris = ZoneOffset.ofHoursMinutesSeconds(0, 9, 21);

export const convert = (dateTime: LocalDateTime): [string, string] => {
  const totalSeconds = floor(dateTime.toLocalTime().toNanoOfDay() / 864000000);
  const time = `${floor(totalSeconds / 10000)} h. ${
    floor(totalSeconds / 100) % 100
  } m. ${totalSeconds % 100} s. t.m.P.`;
  const ymd = `${dateTime.year()}-${dateTime.monthValue()}-${dateTime.dayOfMonth()}`;
  return [new Floreal(ymd).toFullDateString(), time];
};

export const now = () => convert(LocalDateTime.now(paris));
