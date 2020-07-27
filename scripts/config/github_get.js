module.exports = {
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': process.env.USER.toString(),
    Authorization: 'token ' + process.env.GITHUB_TOKEN.toString()
  } 
}