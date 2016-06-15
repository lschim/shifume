var getConfig = require('hjs-webpack')
var config = getConfig({
  html: false,
  isDev: true,
  in: 'client/application.js',
  out: 'public',
  clearBeforeBuild: 'login.js',
})

// Extends hjs generated config
config.entry = {
  main: config.entry
}

config.output.filename = '[name].js'

module.exports = config
