import * as riot from 'riot';
import { shallow, ShallowWrapper } from '../../src';

const hostNameMixin = {
  init() {
    this.hostName = 'localhost';
  },
};

const globalMixin = {
  init() {
    this.global = true;
  },
};

const directMixin = {
  init() {
    this.pi = 3;
  },
};

describe('shallow', () => {
  describe('mixin', () => {
    let wrapper: ShallowWrapper;
    beforeEach(() => {
      riot.mixin(globalMixin);
      riot.mixin('hostName', hostNameMixin);
      wrapper = shallow(`
        <tag-named>
        </tag-named>
      `);
    });
    afterEach(() => {
      wrapper.unmount();
    });

    it('accept named mixin', () => {
      wrapper.mixin('hostName');

      expect(wrapper.instance).toHaveProperty('hostName', 'localhost');
    });

    it('accept global mixin', () => {
      wrapper.mixin(directMixin);

      expect(wrapper.instance).toHaveProperty('pi', 3);
    });
  });
});
