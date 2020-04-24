/* eslint-disable lines-between-class-members */
declare module 'floreal' {
  export class Date {
    constructor();
    constructor(value: number | string);
    constructor(
      year: number,
      month: number,
      date?: number,
      hours?: number,
      minutes?: number,
      seconds?: number,
      ms?: number
    );

    toFullDateString(): string;
    toShortDateString(): string;

    setYear(year: number): void;
    setYearDecimal(year: number): void;
    setMonth(month: number): void;
    setDay(day: number): void;
    setDate(year: number, month: number, day: number): void;

    year(): string;
    yearDecimal(): number;
    isYearSextile(): boolean;
    firstDayOfYear(): Date;
    dayOfYear(): number;
    month(): number;
    isComplementaryDay(): boolean;
    monthName(): string;
    dayOfMonth(): number;
    day(): number;
    dayOfDecade(): number;
    dayOfWeek(): number;
    decade(): number;
    dayName(): string;
    dayTitle(): string;
  }
}
