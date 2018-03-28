import { shallow } from '../../src/enzyme';

describe('enzyme-riot-adapter', () => {
  describe('shallow', () => {
    describe('factory method', () => {
      it('should accept 2 args', () => {
        expect(() => shallow('<tag></tag>', 'tag')).not.toThrow();
      });

      it('should accept 3 args', () => {
        expect(() =>
          shallow('<tag></tag>', 'tag', { data: 'test' })
        ).not.toThrow();
      });

      it('should accept 4 args', () => {
        expect(() =>
          shallow(
            '<tag></tag>',
            'tag',
            { data: 'test' },
            { disableLifecycleMethods: true }
          )
        ).not.toThrow();
      });

      describe('shorthand for single tags', () => {
        it('should accept one tag source', () => {
          expect(() => shallow('<tag></tag>')).not.toThrow();
        });

        it('should accept one tag source beginning with spaces and line-breaks', () => {
          expect(() => shallow(' \n\t   <tag></tag>')).not.toThrow();
        });

        it('should accept one tag source beginning with javascript expressions', () => {
          expect(() =>
            shallow('(function() {})();\n<tag></tag>')
          ).not.toThrow();
        });

        it('cannot accept one tag source beginning with specific sequence as well as non-shorthand', () => {
          expect(() =>
            shallow('var x = "<is-not-tag>";<tag></tag>', 'tag')
          ).toThrowError();
          expect(() =>
            shallow('var x = "<is-not-tag>";<tag></tag>')
          ).toThrowError();
        });
      });
    });
  });
});
