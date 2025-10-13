// https://github.com/artka54/navigator-languages-parse
// Copyright 2018 Arturs "artka54" Kalnins
// MIT License

function getUsersPreferredLanguages(): readonly string[] | undefined {
  if (navigator.languages !== undefined) {
    return navigator.languages;
  } else if (navigator.language !== undefined) {
    return [navigator.language];
  } else {
    return undefined;
  } // create else for final fallback, and also create a test for it
}

/**
 * @param  {array} acceptedLangs - pass languages that you accept
 * @param {array} defaultLang - indicate default language to fallback (optional)
 * @return {string} - suitable locale (the one that matches the user preferred or default)
 */
export function parseLanguages(
  acceptedLangs: readonly string[],
  defaultLang: string
): string;
export function parseLanguages(
  acceptedLangs: readonly string[],
  defaultLang?: false
): string | undefined;
export function parseLanguages(
  acceptedLangs: readonly string[],
  defaultLang: false | string = false
) {
  const userPref = getUsersPreferredLanguages();

  const match = userPref?.find((lang) => acceptedLangs.includes(lang));

  if (match === undefined && typeof defaultLang === 'string') {
    return defaultLang;
  }

  return match;
}
