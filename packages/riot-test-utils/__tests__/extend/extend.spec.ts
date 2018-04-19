import {
  shallow,
  RiotWrapper,
  WeakWrapper,
  extend,
  WrapperExtensions,
} from '../../src';

const EXTEND_MOCK = jest.fn();

extend({
  is: function(this: RiotWrapper | WeakWrapper, selector: string) {
    return EXTEND_MOCK.call(this, selector);
  },
});

//declare module '../../src/lib/wrappers/WrapperExtensions' {
declare interface WrapperExtensions {
  is(selctor: string): boolean;
}
//}

describe('extend', () => {
  beforeEach(() => {
    EXTEND_MOCK.mockReset();
  });

  describe('RiotWrapper', () => {
    it('add methods', () => {
      const wrapper = shallow('<tag></tag>');

      expect((wrapper as WrapperExtensions).is('success'));

      expect(EXTEND_MOCK).toHaveBeenCalledWith('success');
    });
  });
});
