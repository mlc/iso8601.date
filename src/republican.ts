import { Temporal } from 'temporal-polyfill';
import { Date as Floreal } from 'floreal';
import { timeToNs } from './util';

export const paris: Temporal.TimeZoneProtocol = {
  id: 'Paris_Meridian',
  getOffsetNanosecondsFor(_instant: Temporal.Instant | string): number {
    return 561000000000;
  },
  getPossibleInstantsFor(
    _dateTime: Temporal.PlainDateTime | Temporal.PlainDateTimeLike | string
  ): Temporal.Instant[] {
    // um ok
    return [];
  },
};

export const convert = (dateTime: Temporal.PlainDateTime): [string, string] => {
  const totalSeconds = Math.floor(timeToNs(dateTime) / 864000000);
  const time = `${Math.floor(totalSeconds / 10000)} h. ${
    Math.floor(totalSeconds / 100) % 100
  } m. ${totalSeconds % 100} s. t.m.P.`;
  const ymd = `${dateTime.year}-${dateTime.month}-${dateTime.day}`;
  return [new Floreal(ymd).toFullDateString(), time];
};

export const now = () => convert(Temporal.Now.plainDateTimeISO(paris));
