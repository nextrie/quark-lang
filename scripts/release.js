const child = require('child_process'),
  dotenv = require('dotenv').config().parsed,
  axios = require('axios'),
  categorize = require('./libs/categorize'),
  create_release = require('./libs/create_release'),
  format_date = require('./libs/format_date'),
  get_version = require('./libs/get_version'),
  sort_categories = require('./libs/sort_categories'),
  sort_by_category = require('./libs/sort_by_category')

// Fetching and logging git changes.
child.exec('git fetch && git log --pretty=format:"%s"', function (error, content) {
  if (error) throw error
  // Commits decomposition.
  content = content
    .split(/\r?\n/g)
    .map(x => x.trim())

  // Checking if commit starts with release emoji.
  if (!content[0].startsWith('🔖')) return

  // Fetching releases from repository.
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
    // Checking if there are releases.
    if (result.data.length === 0) {
      version = 'v0.0.1'
    } else {
      version = result.data[0].tag_name
      date    = '--since=' + format_date(result.data[0].published_at)
    }

    version = get_version(version)

    // Fetching commits since date variable.
    child.exec(`git log --pretty=format:"%s" ${date}`, {cwd: process.cwd()}, function (error, content) {
      content = content
        .split(/\r?\n/g)
        .map(x => x.trim())

      const commit_categories = content.map(x => x = {
        commit: x,
        category: categorize(x)
      })

      const category_sorted = sort_categories(sort_by_category(commit_categories))

      // Pushing changes to github.
      child.exec('git push --force', function (error, content) {
        if (error) throw error
        // Creating new release.
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