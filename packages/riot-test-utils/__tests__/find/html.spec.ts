import { find, WeakWrapper } from '../../src';

describe('find', () => {
  describe('html', () => {
    let element: HTMLDivElement;
    let wrapper: WeakWrapper;

    beforeEach(() => {
      element = document.createElement('div');
      element.innerHTML =
        '<div><h1>a</h1><div class="is-single"><p>b<br />c</p></div></div>';
    });

    afterEach(() => {
      (wrapper as any) = null;
      element.innerHTML = '';
    });

    it('get outer HTML string', () => {
      wrapper = find('div.is-single', element);
      expect(wrapper.html()).toBe('<div class="is-single"><p>b<br>c</p></div>');
    });

    it('throws if multiple', () => {
      wrapper = find('div', element);
      expect(() => wrapper.html()).toThrowError();
    });
  });
});
