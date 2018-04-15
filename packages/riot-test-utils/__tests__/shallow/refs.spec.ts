import { shallow, ShallowWrapper } from '../../src';

describe('shallow', () => {
  describe('refs', () => {
    it('renders static tag', () => {
      type TagRefs = { button: HTMLButtonElement };
      const wrapper = shallow<{}, TagRefs>(
        '<tag><button ref="button">Push me!</button></tag>'
      );

      expect(wrapper.refs()).toHaveProperty('button');

      const button = wrapper.refs().button;

      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(button.textContent).toBe('Push me!');
    });
  });
});
