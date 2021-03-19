const tryLocalStorage = () => {
  try {
    if (window.localStorage) {
      return true
    }
  } catch (err) {
    // do nothing
  }
  return false
}

export default tryLocalStorage()
