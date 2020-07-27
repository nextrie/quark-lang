// Function return next new version.
module.exports = function get_version (version) {
  version = version.slice(1).split('.').map(x => parseInt(x)).reverse()
  for (const index in version) {
    const value = version[index]
    if (value + 1 < 10) {
      version[index] += 1
      break
    } else {
      const i = version.slice(0, parseInt(index) + 1)
      version.splice(0, parseInt(index) + 1, ...(new Array(i.length).fill(0)))
      continue
    }
  }
  return 'v' + version.reverse().join('.')
}