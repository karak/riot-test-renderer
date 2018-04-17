import { find, WeakWrapper } from '../../src';

describe('find', () => {
  describe('text', () => {
    let element: HTMLDivElement;
    let wrapper: WeakWrapper;

    beforeEach(() => {
      element = document.createElement('div');
      element.innerHTML =
        '<div><h1>Text spec</h1><p>This is a first paragraph.</p></div>';
    });

    afterEach(() => {
      (wrapper as any) = null;
      element.innerHTML = '';
    });

    it('get concatnated text', () => {
      wrapper = find('div', element);
      expect(wrapper.text()).toBe('Text specThis is a first paragraph.');
    });

    it('throws if multiple', () => {
      wrapper = find('h1, p', element);
      expect(() => wrapper.text()).toThrowError();
    });
  });
});
