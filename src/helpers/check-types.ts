export const isBoolean = (value: string) => {
  if (['true', 'false', 't', 'f', 'TRUE', 'FALSE', 'T', 'F'].includes(value)) {
    return true
  }
  return false
}

export const isNumber = (value: string) => {
  if (isNaN(parseInt(value, 10)) || isNaN(parseFloat(value)) || isNaN(+value)) {
    return false
  }
  return true
}
