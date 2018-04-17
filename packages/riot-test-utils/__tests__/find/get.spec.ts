import { find, WeakWrapper } from '../../src';

describe('find', () => {
  describe('get', () => {
    let element: HTMLDivElement;
    let wrapper: WeakWrapper;
    beforeEach(() => {
      element = document.createElement('div');
      element.innerHTML = `
        <button>found</button>
        <form>
          <input type="button" value="found">
          <input type="hidden" value="not found">
          <button disabled>not found</button>
        </form>
      `;

      wrapper = find('button:enabled, input[type="button"]', element);
    });

    afterEach(() => {
      (wrapper as any) = undefined;
      element.innerHTML = '';
    });

    it('returns all the elements as array without an argument', () => {
      const gotten = wrapper.get();
      expect(gotten).toHaveLength(2);
      expect(gotten).toBeInstanceOf(Array);
      expect(gotten[0]).toBeInstanceOf(HTMLButtonElement);
      expect(gotten[0].textContent).toBe('found');
      expect(gotten[1]).toBeInstanceOf(HTMLInputElement);
      expect((gotten[1] as HTMLInputElement).value).toBe('found');
    });

    it('returns same array as previous returned', () => {
      const gotten = wrapper.get();
      const gottenAgain = wrapper.get();
      expect(gottenAgain).toBe(gotten);
    });

    it('returns each element with an index', () => {
      expect(wrapper).toHaveLength(2);
      const gotten0 = wrapper.get(0);
      const gotten1 = wrapper.get(1);
      expect(gotten0).toBeInstanceOf(HTMLButtonElement);
      expect(gotten1).toBeInstanceOf(HTMLInputElement);
    });

    it('returns each element in reversed order with an negative index', () => {
      expect(wrapper).toHaveLength(2);
      const gottenLast0 = wrapper.get(-1);
      const gottenLast1 = wrapper.get(-2);
      expect(gottenLast1).toBeInstanceOf(HTMLButtonElement);
      expect(gottenLast0).toBeInstanceOf(HTMLInputElement);
    });
  });
});
