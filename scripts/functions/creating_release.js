const axios = require('axios').default
const create_release = require('../libs/create_release')

module.exports = async function (version, category_sorted) {
  await axios({
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
  return
}