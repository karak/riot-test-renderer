import { shallow } from '../../src/enzyme';

describe('enzyme-riot-adapter', () => {
  describe('shallow', () => {
    describe('factory method', () => {
      it('should accept 2 args', () => {
        expect(() => shallow('<tag></tag>', 'tag')).not.toThrow();
      });

      it('should accept 3 args', () => {
        expect(() => shallow('<tag></tag>', 'tag', { data: 'test' })).not.toThrow();
      });

      it('should accept 4 args', () => {
        expect(() => shallow('<tag></tag>', 'tag', { data: 'test' }, { disableLifecycleMethods: true })).not.toThrow();
      });
    });
  });
});
