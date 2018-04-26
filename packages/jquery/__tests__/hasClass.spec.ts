import { mount, RiotWrapper } from 'riot-test-utils';
import '../src';

describe('hasClass', () => {
  let wrapper: RiotWrapper;

  beforeEach(() => {
    wrapper = mount(
      `<tag class="visible"><p><span class="active"></span></p></tag>`
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('RiotWrapper', () => {
    it('test by selector', () => {
      expect(wrapper.hasClass('visible')).toBeTruthy();
      expect(wrapper.hasClass('invisible')).toBeFalsy();
    });
  });

  describe('WeakWrapper', () => {
    it('test by selector', () => {
      expect(wrapper.find('p span').hasClass('active')).toBeTruthy();
    });
  });
});
