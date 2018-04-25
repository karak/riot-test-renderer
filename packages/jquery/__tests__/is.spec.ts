import { mount, RiotWrapper } from 'riot-test-utils';
import '../src';

describe('is', () => {
  let wrapper: RiotWrapper;

  beforeEach(() => {
    wrapper = mount(`<tag><p class="active"></p><p></p></tag>`);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('RiotWrapper', () => {
    it('test by selector', () => {
      expect(wrapper.is('tag')).toBeTruthy();
      expect(wrapper.is('not-tag')).toBeFalsy();
    });

    it('test by function', () => {
      expect(
        wrapper.is(
          (i: number, el: HTMLElement) =>
            i === 0 && el instanceof HTMLUnknownElement
        )
      ).toBeTruthy();
    });
  });

  describe('WeakWrapper', () => {
    it('test by selector', () => {
      expect(wrapper.find('p').is('p')).toBeTruthy();
      expect(wrapper.find('p.active').is('.active')).toBeTruthy();
      expect(wrapper.find('p:not(.active)').is('.active')).toBeFalsy();
    });

    it('test by function', () => {
      expect(
        wrapper
          .find('p:first-child')
          .is((i: number, el: HTMLElement) => el.classList.contains('active'))
      ).toBeTruthy();
    });
  });
});
