const child = require('child_process'),
  util = require('util'),
  exec = util.promisify(child.exec)

module.exports = exec