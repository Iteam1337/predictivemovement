const secondsToHm = (seconds) => {
  seconds = Number(seconds)
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  const hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
  const mDisplay = m > 0 ? m + (m == 1 ? ' minut, ' : ' minuter, ') : ''
  return hDisplay + mDisplay
}

module.exports = { secondsToHm }
