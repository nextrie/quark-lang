const display_category = require('./display_category')

// Function return release markdown content.
module.exports = function create_release (informations, categories) {
  let release = ''

  release += `## New ${informations.version} release.\n`

  for (const category in categories) {
    release += display_category(category, categories[category])
  }

  return release
}