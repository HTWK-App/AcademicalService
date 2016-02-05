'use strict';

const extractor = require('../extractors/extractor.js');
const boom = require('boom');
const co = require('../common');

module.exports = {
  semesterHandler: function(request, reply) {
    let result = extractor.getCalender(encodeURIComponent(request.params.semester));
    if (!co.isEmpty(result))
      reply(result);
    else
      reply(boom.resourceGone('Something bad happend...somehow we can not deliver the requested resource'));
  }
};
