export const getStringByLocale = (stringObj, key, locale) => {
  if(!stringObj) return '';
  const langMap = {
    'zh': 'Zh',
    'en': 'En',
  }
  return stringObj[`${key}${langMap[locale]}`];
}