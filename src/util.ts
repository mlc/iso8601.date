import type { Temporal } from 'temporal-polyfill';

export const difference = <T>(
  first: readonly T[],
  ...rest: readonly T[][]
): T[] => {
  if (rest.length === 0) {
    return [...first];
  }
  const it = new Set(first);
  rest.forEach((arr) =>
    arr.forEach((elt) => {
      it.delete(elt);
    })
  );
  return [...it];
};

export const timeToNs = (
  t: Temporal.PlainTime | Temporal.PlainDateTime
): number =>
  ((((t.hour * 60 + t.minute) * 60 + t.second) * 1000 + t.millisecond) * 1000 +
    t.microsecond) *
    1000 +
  t.nanosecond;
