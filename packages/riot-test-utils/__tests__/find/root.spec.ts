import { find, WeakWrapper } from '../../src';

describe('find', () => {
  describe('isMounted', () => {
    let element: HTMLDivElement;
    let wrapper: WeakWrapper;

    beforeEach(() => {
      element = document.createElement('div');
    });

    afterEach(() => {
      element.innerHTML = '';
    });

    it('can get root', () => {
      element.innerHTML = '<p></p>';
      wrapper = find('p', element);
      expect(wrapper.root.tagName.toLowerCase()).toBe('p');
    });

    it('cannot get root when it has multiple results', () => {
      element.innerHTML = '<p></p><div><p></p></div>';
      wrapper = find('p', element);
      expect(() => wrapper.root).toThrowError();
    });
  });
});
