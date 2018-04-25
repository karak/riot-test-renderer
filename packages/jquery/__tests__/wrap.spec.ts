import { mount, RiotWrapper } from 'riot-test-utils';
import '../src';

describe('$()', () => {
  let wrapper: RiotWrapper;

  beforeEach(() => {
    wrapper = mount(`<tag><p class="active"></p><p></p></tag>`);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('RiotWrapper', () => {
    it('get', () => {
      const $tag = wrapper.$();
      expect($tag).toBeDefined();
      expect($tag).toHaveLength(1);
      expect($tag.filter('tag')).toHaveLength(1);
    });
  });

  describe('WeakWrapper', () => {
    it('get', () => {
      const $tag = wrapper.find('p').$();
      expect($tag).toBeDefined();
      expect($tag).toHaveLength(2);
      expect($tag.filter('.active')).toHaveLength(1);
    });
  });
});
