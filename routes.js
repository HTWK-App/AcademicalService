'use strict';

const Joi = require('joi');
const server = require('./server');
const sem = require('./controllers/semester');

server.route({
  method: 'GET',
  path: '/academical/{semester}',
  handler: sem.semesterHandler,
  config: {
    validate: {
      params: {
        semester: Joi.string().valid('ws', 'ss')
      }
    },
    tags: ['api'],
    description: 'Get the academical calender for the specified semester'
  }
});
