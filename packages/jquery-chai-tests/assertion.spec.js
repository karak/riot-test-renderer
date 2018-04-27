const { mount } = require('riot-test-utils');
require('riot-test-utils-jquery');
const $ = require('jquery');
require('chai').should();
require('chai-jquery');

describe('riot-test-utils-jquery', () => {
  describe('jquery-chai', () => {
    it('has attr', () => {
      const wrapper = mount(`<tag id="test"></tag>`);
      $(wrapper.root).should.have.attr('id', 'test');
      //expect($(wrapper.root)).to.have.attr('id', 'test');
      //expect(wrapper.$()).to.have.attr('id', 'test');
      //expect(wrapper).to.have.attr('id', 'test');
    });
  });
});

