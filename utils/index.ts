export const getStringByLocale = (
  stringObj: any,
  key: string,
  locale: string
): string => {
  if (!stringObj) return ''
  const langMap = {
    zh: 'tc',
    en: 'en',
  }
  return stringObj[`${key}_${langMap[locale]}`]
}
