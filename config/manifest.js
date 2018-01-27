const Good = require('good')
const ConfigServer = require('./server')
const routes = require('./../routes')

const Environment = ConfigServer['env']
const AppVersion = ConfigServer['version']

const goodOptions = {
  includes: {
    request: ['payload'],
    response: ['payload']
  },
  reporters: {
    consoleReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        log: '*',
        error: '*',
        response: '*',
        request: '*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}

let plugins = {
  server: {
    port: ConfigServer.port,
    host: ConfigServer.host,
    routes: {
      cors: true
    }
  },
  register: {
    plugins: [
      { plugin: routes },
      { plugin: Good, options: goodOptions }
    ]
  }
}

if (Environment.toLowerCase() === 'development') {
  plugins['register']['plugins'].push({
    plugin: require('blipp')
  }, {
    plugin: require('hapi-swagger'),
    options: {
      info: {
        title: 'API Documentation',
        version: AppVersion,
        contact: {
          name: 'Your Email',
          email: 'email@example.com'
        }
      }
    }
  }, {
    plugin: require('inert')
  }, {
    plugin: require('vision')
  })
}

module.exports = plugins
