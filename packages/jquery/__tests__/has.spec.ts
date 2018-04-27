import { mount, RiotWrapper } from 'riot-test-utils';
import '../src';

describe('has', () => {
  let wrapper: RiotWrapper;

  beforeEach(() => {
    wrapper = mount(`<tag><p><span class="active"></span></p></tag>`);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('RiotWrapper', () => {
    it('test by selector', () => {
      expect(wrapper.has('span.active')).toBeTruthy();
      expect(wrapper.has('p > span')).toBeTruthy();
    });
  });

  describe('WeakWrapper', () => {
    it('test by selector', () => {
      expect(wrapper.find('p').has('span.active')).toBeTruthy();
      expect(wrapper.find('p').has('span')).toBeTruthy();
    });
  });
});
