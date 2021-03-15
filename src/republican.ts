import { Date as Floreal } from 'floreal';
import { Temporal } from 'proposal-temporal';
import floor from 'lodash/floor';
import { nanoOfDay } from './utils';

export const paris = Temporal.TimeZone.from('+00:09:21');

export const convert = (dateTime: Temporal.PlainDateTime): [string, string] => {
  const totalSeconds = floor(nanoOfDay(dateTime.toPlainTime()) / 864000000);
  const time = `${floor(totalSeconds / 10000)} h. ${
    floor(totalSeconds / 100) % 100
  } m. ${totalSeconds % 100} s. t.m.P.`;
  const ymd = `${dateTime.year}-${dateTime.month}-${dateTime.day}`;
  return [new Floreal(ymd).toFullDateString(), time];
};

export const now = () => convert(Temporal.now.plainDateTimeISO(paris));
