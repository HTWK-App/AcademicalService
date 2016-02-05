'use strict';

const hapi = require('hapi');
const extractor = require('./extractors/extractor.js');

const server = new hapi.Server();
server.connection({
  host: 'localhost',
  port: 9000
});

module.exports = server;

let plugins = {
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
};


server.register(plugins, (err) => {
  if (err) {
    console.error(err);
    global.process.exit();
  } else {
    server.start(function() {
      server.log('info', 'Server started at ' + server.info.uri);
      //global.server = server;
      require('./routes');
    });
    extractor.fillCalender();
  }
});
