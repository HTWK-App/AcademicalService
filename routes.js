'use strict';

const extractor = require('./extractor.js');
const Joi = require('joi');
const boom = require('boom');
const server = require('./server');

server.route({
  method: 'GET',
  path: '/academical/{semester}',
  handler: function(request, reply) {
    let result = extractor.getCalender(encodeURIComponent(request.params.semester));
    if (!isEmpty(result))
      reply(result);
    else
      reply(boom.resourceGone('Something bad happend...somehow we can not deliver the requested resource'));
  },
  config: {
    validate: {
      params: {
        semester: Joi.any().valid('ws', 'ss')
      }
    }
  }
});

function isEmpty(toTest) {
  return (toTest === undefined ||
    toTest === null ||
    toTest === "" ||
    (toTest instanceof Object && Object.keys(toTest).length === 0) ||
    (toTest instanceof Array && toTest.length === 0));
}
