import { shallow, ShallowWrapper } from '../../src';

describe('shallow', () => {
  describe('opts', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
      wrapper = shallow(`
        <my-button onclick={ clickLink }>
          clickLink() {
            this.trigger('click')
          }
        </my-button>
      `);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('simulates to click a link', () => {
      const fn = jest.fn();
      wrapper.instance().on('click', fn);

      expect(wrapper.simulate('click')).toBe(true);

      expect(fn).toHaveBeenCalled();
    });
  });
});
