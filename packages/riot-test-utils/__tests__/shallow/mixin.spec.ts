import * as riot from 'riot';
import { shallow, RiotWrapper } from '../../src';

const hostNameMixin: any = {
  init(this: any) {
    this.hostName = 'localhost';
  },
};

const globalMixin: any = {
  init(this: any) {
    this.global = true;
  },
};

const directMixin: any = {
  init(this: any) {
    this.pi = 3;
  },
};

describe('shallow', () => {
  describe('mixin', () => {
    let wrapper: RiotWrapper;
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
