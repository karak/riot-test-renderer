import { shallow, RiotWrapper } from '../../src';

describe('shallow', () => {
  describe('opts', () => {
    let wrapper: RiotWrapper;

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
      wrapper.instance.on('click', fn);

      wrapper.simulate('click');

      expect(fn).toHaveBeenCalled();
    });

    it('return nothing', () => {
      expect(wrapper.simulate('click')).toBeUndefined();
    });
  });
});
