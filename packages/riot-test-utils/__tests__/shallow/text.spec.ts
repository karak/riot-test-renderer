import { shallow } from '../../src';

describe('shallow', () => {
  describe('text', () => {
    it('get concatnated text', () => {
      const wrapper = shallow(
        `<tag><h1>Text spec</h1><p>This is a first paragraph.</p></tag>`
      );

      expect(wrapper.text()).toBe('Text specThis is a first paragraph.');
    });
  });
});
