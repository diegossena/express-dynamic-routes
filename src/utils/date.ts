export const yearTime = 31536000000
export const monthTime = 2592000000
export const weekTime = 604800000
export const dayTime = 86400000
export const hourTime = 3600000
export const minuteTime = 60000
export const secondTime = 1000

export function getTimeDiff(date1: Date, date2: Date) {
  const diff = Math.abs(date1.getTime() - date2.getTime())
  let result = 0
  let res = ''
  if (diff >= yearTime) {
    result = Math.floor(diff / yearTime)
    res += 'ano'
  } else if (diff >= monthTime) {
    result = Math.floor(diff / monthTime)
    res += 'mes' + (result > 1 ? 'e' : '')
  } else if (diff >= weekTime) {
    result = Math.floor(diff / weekTime)
    res += 'semana'
  } else if (diff >= dayTime) {
    result = Math.floor(diff / dayTime)
    res += 'dia'
  } else if (diff >= hourTime) {
    result = Math.floor(diff / hourTime)
    res += 'hora'
  } else if (diff >= minuteTime) {
    result = Math.floor(diff / minuteTime)
    res += 'minuto'
  } else {
    result = Math.floor(diff / secondTime)
    res += 'segundo'
  }
  if (result > 1) {
    res += 's'
  }
  return `${result} ${res}`
}
export function toString(oDate: Date) {
  const split = new Date(oDate.getTime() - oDate.getTimezoneOffset() * minuteTime)
    .toISOString()
    .split('T')
  split[0] = split[0].split('-').reverse().join('/')
  return split.join(' ')
}
export function toISOFormat(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * minuteTime)
    .toISOString()
    .slice(0, -1)
}
export function diffInDays(datei: Date, datef = new Date()) {
  const timeDiff = Math.abs(datef.getTime() - datei.getTime())
  return Math.floor(timeDiff / dayTime)
}
export function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}
