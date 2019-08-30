module.exports = data => {
  try {
    return JSON.parse(data)
  } catch (_) {
    return {}
  }
}
