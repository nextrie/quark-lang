// All categories and their emojies matches.
const categories = {
  'Improvements': ['⚡️', '✨', '🎉', '💬', '💡', '♿️', '🚚', '⚗', '🧼'],
  'Fixes': ['💩', '💥', '🍻', '🗑', '♻️', '🚨', '💚', '🔒', '🚑', '🔥', '🥅', '✏️'],
  'Node.JS': ['🔧', '🔨', '➕', '➖', '📦', '⬆️', '⬇️'],
  'GitHub': ['📈', '👷', '👥', '📸', '🔀', '⏪', '🔖', '📝', '🚀']
}

// Function basic categorization.
module.exports = function categorize (commit) {
  for (const category in categories) {
    const emojies = categories[category]
    for (const emoji of emojies) {
      if (commit.startsWith(emoji)) {
        return category
      }
    }
  }
  return undefined
}