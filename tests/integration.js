/* eslint dot-notation: 0 */
'use strict';

//Mocking is missing completely TODO add mocked objects

describe('Extractor', () => {

  let expect, mod;

  beforeEach((done) => {
    //Clean everything up before doing new tests
    Object.keys(require.cache).forEach((key) => delete require.cache[key]);
    require('chai').should();
    expect = require('chai').expect;
    mod = require('../extractors/extractor.js'); //TODO insert module
    done();
  });

  context('when ... it', () => {
    it('should ...', () => {
      /* TODO fill in unit test/alter example
      expect(...).to.not.throw(Error);
      ....should.be.an('object').and.contain.keys('id', 'name');
      ....id.should.be.a('number').and.equal(0);
      .....name.should.be.a('string').and.equal('example');*/
    });
  });
});
