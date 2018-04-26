import { mount, RiotWrapper } from 'riot-test-utils';
import '../src';

describe('accessors', () => {
  let wrapper: RiotWrapper;

  beforeEach(() => {
    wrapper = mount(`
      <tag style="color: red">
        <p style="text-indent: 1rem">
          <a href="#">Link</a><span class="active"></span>
        </p>
        <ul>
          <li data-bind="a"></li>
          <li data-bind="1"></li>
        </ul>
        <input type="checkbox" value="accept" checked />
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

  describe('data', () => {
    describe('RiotWrapper', () => {
      it('get', () => {
        expect(wrapper.data('is')).toBe('tag');
      });

      it('set', () => {
        const ret = wrapper.data('was', 'tagged');
        expect(wrapper.data('was')).toBe('tagged');
        expect(ret).toBe(wrapper);
        expect(ret.instance).toBeDefined();
      });
    });

    describe('WeakWrapper', () => {
      it('get', () => {
        expect(wrapper.find('[data-bind]:first-child').data('bind')).toBe('a');
      });

      it('get with conversion', () => {
        expect(wrapper.find('[data-bind]:last-child').data('bind')).toBe(1);
      });

      it('set', () => {
        // Note: jQuery caches the values of "data"
        const ret = wrapper.find('[data-bind]').data('bind', '2');
        expect(wrapper.find('[data-bind]:first-child').data('bind')).toBe('2');
        expect(wrapper.find('[data-bind]:last-child').data('bind')).toBe('2');
        expect(ret.instance).toBeDefined();
      });
    });
  });

  describe('prop', () => {
    describe('RiotWrapper', () => {
      it('get', () => {
        expect(wrapper.prop('lang')).toBe('');
      });

      it('set', () => {
        const ret = wrapper.prop('lang', 'en');
        expect(wrapper.prop('lang')).toBe('en');
        expect(ret).toBe(wrapper);
        expect(ret.instance).toBeDefined();
      });
    });

    describe('WeakWrapper', () => {
      it('get', () => {
        expect(wrapper.find('input[type="checkbox"]').prop('checked')).toBe(true);
      });

      it('set', () => {
        const ret = wrapper.find('input[type="checkbox"]').prop('checked', false);
        expect(wrapper.find('input[type="checkbox"]').prop('checked')).toBe(false);
        expect(ret.instance).toBeDefined();
      });
    });
  });

  describe('val', () => {
    describe.skip('RiotWrapper', () => {
      let wrapper: RiotWrapper;
      beforeEach(() => {
        // TODO: This test requires mount to use <input> for parent elements.
        wrapper = mount(`<tag value="test"></tag>`);
      });

      afterEach(() => {
        wrapper.unmount();
      });

      it('get', () => {
        expect(wrapper.val()).toBe('test');
      });

      it('set', () => {
        const ret = wrapper.val('test-test');
        expect(wrapper.val()).toBe('test-test');
        expect(ret).toBe(wrapper);
        expect(ret.instance).toBeDefined();
      });
    });

    describe('WeakWrapper', () => {
      it('get', () => {
        expect(wrapper.find('input[type="checkbox"]').val()).toBe('accept');
      });

      it('set', () => {
        const ret = wrapper.find('input[type="checkbox"]').val('test-test');
        expect(wrapper.find('input[type="checkbox"]').val()).toBe('test-test');
        expect(ret.instance).toBeDefined();
      });
    });
  });
});
