import { mount, shallow, find, RiotWrapper, WeakWrapper, extend } from '../../src';

const EXTEND_MOCK = jest.fn();

// Extend!
extend({
  is: function(this: RiotWrapper | WeakWrapper, selector: string): boolean {
    return EXTEND_MOCK.call(this, selector);
  },
});

// Add typedefinitions
declare module '../../src' {
  export interface WrapperExtensions {
    is(selctor: string): boolean;
  }
}

describe('extend', () => {
  beforeEach(() => {
    EXTEND_MOCK.mockReset();
  });

  describe('RiotWrapper', () => {
    it('add methods to shallow', () => {
      const wrapper = shallow('<tag></tag>');

      expect(wrapper.is(':enabled'));

      expect(EXTEND_MOCK).toHaveBeenCalledWith(':enabled');
    });

    it('add methods to mount', () => {
      const wrapper = mount('<tag></tag>');

      expect(wrapper.is(':enabled'));

      expect(EXTEND_MOCK).toHaveBeenCalledWith(':enabled');
    });
  });

  describe('WeakWrapper', () => {
    it('add methods to find', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p></p>';
      const wrapper = find('p', element);

      expect(wrapper.is('p'));

      expect(EXTEND_MOCK).toHaveBeenCalledWith('p');
    });

    it('add methods to RiotWrapper.find', () => {
      const wrapper = mount('<tag><p class="hero">Hello!</p></tag>');

      expect(wrapper.find('p').is('.hero'));

      expect(EXTEND_MOCK).toHaveBeenCalledWith('.hero');
  });
});
