export const getStringByLocale = (
  stringObj: any,
  key: string,
  locale: string
): string => {
  if (!stringObj) return ''
  const langMap = {
    zh: 'Zh',
    en: 'En',
  }
  return stringObj[`${key}${langMap[locale]}`]
}
