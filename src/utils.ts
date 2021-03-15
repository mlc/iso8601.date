import { Temporal } from 'proposal-temporal';

export const padBeats = (beatStr: string): string => {
  switch (beatStr.length) {
    case 4:
      return `00${beatStr}`;
    case 5:
      return `0${beatStr}`;
    default:
      return beatStr;
  }
};

export const nanoOfDay = (t: Temporal.PlainTime): number =>
  t.since('00:00:00').total({ unit: 'nanosecond' });

export const haveTz = (tz: string): boolean => {
  try {
    Temporal.TimeZone.from(tz);
    return true;
  } catch {
    return false;
  }
};
