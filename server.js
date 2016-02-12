'use strict';

const hapi = require('hapi');
const extractor = require('./extractors/extractor.js');

const server = new hapi.Server();
server.connection({
  host: 'localhost',
  port: 9000
});

module.exports = server;

const plugins = [
  require('inert'),
  require('vision'), {
    register: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        events: {
          response: '*',
          log: '*'
        }
      }]
    }
  }, {
    register: require('hapi-swagger'),
    options: {
      info: {
        title: 'Academical REST API',
        version: '1.0'
      }
    }
  }
];


server.register(plugins, (err) => {
  if (err) {
    console.error(err);
    global.process.exit();
  } else {
    server.start(() => {
      server.log('info', 'Server started at ' + server.info.uri);
      require('./routes');
    });
    extractor.fillCalender();
  }
});
