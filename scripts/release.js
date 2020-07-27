const exec = require('./functions/exec'),
  dotenv = require('dotenv').config().parsed,
  axios = require('axios').default,
  all = require('./libs/all'),
  github_get = require('./config/github_get'),
  creating_release = require('./functions/creating_release')

async function main () {
  // Fetching and logging git changes.
  let content = await exec('git fetch && git log --pretty=format:"%s"')
  // Commits decomposition.
  content = content.stdout.split(/\r?\n/g).map(x => x.trim())
  // Checking if commit starts with release emoji.
  if (!content[0].startsWith('🔖')) return
  // Fetching releases from repository.
  const content = await axios.get('https://api.github.com/repos/${process.env.USER.toString().toLowerCase()}/${process.env.REPOSITORY.toString()}/releases', github_get)
  let version = '', date = ''
  // Checking if there are releases.
  if (content.data.length === 0) version = 'v0.0.1'
  else {
    version = content.data[0].tag_name
    date = '--since=' + all.format_date(content.data[0].published_at)
  }
  version = all.get_version(version)
  // Fetching commits since date variable.
  content = await exec(`git log --pretty=format:"%s" ${date}`, { cwd: process.cwd() })
  content = content.stdout.split(/\r?\n/g).map(x => x.trim())
  const commit_categories = content.map(x => x = { commit: x, category: all.categorize(x) })
  // Pushing changes to github.
  await exec('git push --force')
  // Creating release.
  await creating_release(version, all.sort_categories(all.sort_by_category(commit_categories)))
}

main()