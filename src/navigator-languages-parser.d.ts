/* eslint-disable no-underscore-dangle */

declare module 'navigator-languages-parser' {
  class NavigatorLanguagesParser {
    private static _getUsersPreferredLanguages(): string[] | undefined;

    static parseLanguages(
      acceptedLangs: readonly string[],
      defaultLang: string
    ): string;
    static parseLanguages(
      acceptedLangs: readonly string[],
      defaultLang?: false
    ): string | undefined;
  }

  export = NavigatorLanguagesParser;
}
