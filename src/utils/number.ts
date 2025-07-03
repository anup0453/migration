export function currencyFormat(value: number, locale = 'de-DE') {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(value)
}
