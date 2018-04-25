import { mount, RiotWrapper } from 'riot-test-utils';
import '../src';

describe('accessors', () => {
  let wrapper: RiotWrapper;

  beforeEach(() => {
    wrapper = mount(`
      <tag style="color: red">
        <p style="text-indent: 1rem"><a href="#">Link</a><span class="active"></span></p>
      </tag>`);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('attr', () => {
    describe('RiotWrapper', () => {
      it('get', () => {
        expect(wrapper.attr('style')).toBe('color: red');
      });

      it('set', () => {
        const ret = wrapper.attr('style', 'color: blue');
        expect(wrapper.attr('style')).toBe('color: blue'); // success to get
        expect(ret.instance).toBeDefined(); // be RiotWrapper
      });
    });

    describe('WeakWrapper', () => {
      it('get', () => {
        expect(wrapper.find('a').attr('href')).toBe('#');
      });

      it('set', () => {
        const ret = wrapper.find('a[href]').attr('href', '#!/item');
        expect(wrapper.find('a[href]')).not.toBe('#');
        expect(ret.instance).toBeDefined();
      });
    });
  });

  describe('css', () => {
    describe('RiotWrapper', () => {
      it('get', () => {
        expect(wrapper.css('color')).toBe('red');
      });

      it('set', () => {
        const ret = wrapper.css('color', 'blue');
        expect(wrapper.css('color')).toBe('blue');
        expect(ret.instance).toBeDefined();
      });

      it('batch set', () => {
        const ret = wrapper.css({ color: 'blue' });
        expect(wrapper.css('color')).toBe('blue');
        expect(ret.instance).toBeDefined();
      });
    });

    describe('WeakWrapper', () => {
      it('get', () => {
        expect(wrapper.find('p[style]').css('text-indent')).toBe('1rem');
      });
    });
  });

  describe.skip('data', () => {});

  describe.skip('prop', () => {});

  describe.skip('value', () => {});
});
