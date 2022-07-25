
const localItems = {}

export const setItem = (index, data) => {
  try {
    window?.localStorage?.setItem(index, JSON.stringify(data))
  } catch (e) {
    console.error(e)
  }
}

export const setLocalItem = (index, data) => {
  localItems[index] = data
}

export const getItem = (index, defaultValue = null) => {
  try {
    const value = window?.localStorage?.getItem(index)

    if (value !== null) {
      return JSON.parse(value)
    }
  } catch (e) {
    console.error(e)
  }

  return localItems[index] ?? defaultValue
}
