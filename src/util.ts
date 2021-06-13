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
