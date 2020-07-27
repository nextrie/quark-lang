const child  = require('child_process'),
      dotenv = require('dotenv').config().parsed,
      axios  = require('axios')


const categories = {
  'Improvements': ['⚡️', '✨', '🎉', '💬', '💡', '♿️', '🚚', '⚗', '🧼'],
  'Fixes': ['💩', '💥', '🍻', '🗑', '♻️', '🚨', '💚', '🔒', '🚑', '🔥', '🥅', '✏️'],
  'Node.JS': ['🔧', '🔨', '➕', '➖', '📦', '⬆️', '⬇️'],
  'GitHub': ['📈', '👷', '👥', '📸', '🔀', '⏪', '🔖', '📝', '🚀']
}

function unemoji (string = '') {
  return string.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
}

function categorize (commit) {
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

function get_version (version) {
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

function format_date (date) {
  date = date
    .match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)[0].split('T')
  let f_date = date,
      time = f_date[1]
        .split(/:/g)
        .map((x, index) => index === 0 ? x = parseInt(x) + 2 : x)
        .join(':'),
      final_date = [f_date[0], 'T', time]
        .join('')

  return final_date
}

function sort_by_category (items) {
  const sort_variable = {}
  for (const item of items) {
    if (!sort_variable[item.category]) sort_variable[item.category] = []
    sort_variable[item.category].push(unemoji(item.commit).trim())
  }
  return sort_variable
}

function sort_categories (categories) {
  const tmp_categories = {},
        order          = ['Improvements', 'Fixes', 'Node.JS', 'GitHub'],
        tmp_order      = []

  for (const index in order) {
    const item = order[index]
    if (categories[item]) tmp_order.push(item)
  }

  while (Object.keys(tmp_categories).length !== Object.keys(categories).length) {
    for (const value in categories) {
      if (tmp_order[0] === value) {
        tmp_categories[value] = categories[value]
        tmp_order.shift()
      }
    }
  }

  return tmp_categories
  
}

function display_category (category_name, category_items) {

  let category_content = ''

  category_content += `### ${category_name}:\n`
  
  for (const item of category_items) {
    category_content += `- ${item}\n`
  }

  return category_content

}

function create_release (informations, categories) {
  let release = ''

  release += `## New ${informations.version} release.\n`

  for (const category in categories) {
    release += display_category(category, categories[category])
  }

  return release
}

child.exec('git fetch && git log --pretty=format:"%s"', function (error, content) {
  if (error) throw error
  content = content
    .split(/\r?\n/g)
    .map(x => x.trim())

  if (!content[0].startsWith('🔖')) return
  axios.get(`https://api.github.com/repos/${process.env.USER.toString().toLowerCase()}/${process.env.REPOSITORY.toString()}/releases`, {
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': process.env.USER.toString(),
        Authorization: 'token ' + process.env.GITHUB_TOKEN.toString()
    } 
  })
  .then(function (result) {
    let version = '',
        date    = ''
    if (result.data.length === 0) {
      version = 'v0.0.1'
    } else {
      version = result.data[0].tag_name
      date    = '--since=' + format_date(result.data[0].published_at)
    }

    version = get_version(version)

    child.exec(`git log --pretty=format:"%s" ${date}`, {cwd: process.cwd()}, function (error, content) {
      content = content
        .split(/\r?\n/g)
        .map(x => x.trim())

      const commit_categories = content.map(x => x = {
        commit: x,
        category: categorize(x)
      })

      const category_sorted = sort_categories(sort_by_category(commit_categories))

      child.exec('git push --force', function (error, content) {
        if (error) throw error
        axios({
          method: 'POST',
          url: `https://api.github.com/repos/${process.env.USER}/${process.env.REPOSITORY}/releases`,
          headers: {
              'Content-Type': 'application/json',
              'User-Agent': process.env.USER,
              'Authorization': 'token ' + process.env.GITHUB_TOKEN.toString()
          },
          data: {
              tag_name: version.toString(),
              target_commitish: 'master',
              name: version.toString(),
              body: create_release({ version: version.slice(1) }, category_sorted),
              draft: false,
              prerelease: false
          }  
        })
        .catch(function (error) {
          console.log(error.response.data.errors)
        })
      })

    })

  })
  .catch(function (error) {
    console.log(error)
  })
})