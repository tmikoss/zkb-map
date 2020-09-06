import round from 'lodash/round'

const thousand = 1_000
const million = thousand * thousand
const billion = million * thousand
const precision = 1

const displayBillionsFrom = billion / 2
const displayMillionsFrom = million / 2

export const stringifyPrice = (value: number): string => {
  if (value > displayBillionsFrom) {
    return `${round(value / billion, precision)}b`
  } else if (value > displayMillionsFrom) {
    return `${round(value / million, precision)}m`
  } else {
    return `${round(value / thousand, precision)}k`
  }
}
