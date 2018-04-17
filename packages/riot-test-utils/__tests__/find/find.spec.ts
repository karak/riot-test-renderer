import { find, WeakWrapper } from '../../src';

describe('find', () => {
  describe('get', () => {
    let element: HTMLDivElement;
    let wrapper: WeakWrapper;
    beforeEach(() => {
      element = document.createElement('div');
      element.innerHTML = `
        <form class="marked">
          <div>
            <input type="text" value="1">
          </div>
          <input type="text" value="2">
          <div class="marked">
            <input type="text" value="3">
          </div>
        </form>
        <form>
          <input value="4">
        </form>
      `;

      const contextWrapper = find('.marked', element);
      wrapper = contextWrapper.find('input');
    });

    afterEach(() => {
      (wrapper as any) = undefined;
      element.innerHTML = '';
    });

    it('can find selected items', () => {
      expect(wrapper.get(0)).toBeInstanceOf(HTMLInputElement);
      expect(wrapper.get(1)).toBeInstanceOf(HTMLInputElement);
      expect(wrapper.get(2)).toBeInstanceOf(HTMLInputElement);
    });

    it('have unique elements', () => {
      expect(wrapper).toHaveLength(3);
    });

    it('is sorted by appeared order in the document', () => {
      expect(wrapper.get(0)).toHaveProperty('value', '1');
      expect(wrapper.get(1)).toHaveProperty('value', '2');
      expect(wrapper.get(2)).toHaveProperty('value', '3');
    });
  });
});
