import { shallow, RiotWrapper, WeakWrapper, extend } from '../../src';

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
    it('add methods', () => {
      const wrapper = shallow('<tag></tag>');

      expect(wrapper.is(':enabled'));

      expect(EXTEND_MOCK).toHaveBeenCalledWith(':enabled');
    });
  });
});
