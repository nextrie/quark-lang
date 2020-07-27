const unemoji = require('./unemoji')

// Function order commits.
module.exports = function sort_by_category (items) {
  const sort_variable = {}
  for (const item of items) {
    if (!sort_variable[item.category]) sort_variable[item.category] = []
    sort_variable[item.category].push(unemoji(item.commit).trim())
  }
  return sort_variable
}
