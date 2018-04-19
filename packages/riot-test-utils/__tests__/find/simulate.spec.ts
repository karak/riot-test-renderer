import { find, WeakWrapper } from '../../src';

describe('find', () => {
  describe('simulate', () => {
    let element: HTMLDivElement;
    let wrapper: WeakWrapper;
    let submitHandler: jest.MockInstance<void>;

    beforeEach(() => {
      element = document.createElement('div');
      element.innerHTML = `
      <form>
        <input value="a">
        <input value="b" checked>
        <input value="c" disabled>
      </form>
      `;
      submitHandler = jest.fn();
      element
        .querySelector('form')!
        .addEventListener('submit', submitHandler as any);
    });

    afterEach(() => {
      element
        .querySelector('form')!
        .removeEventListener('submit', submitHandler as any);
      element.innerHTML = '';
    });

    it('can fire "click" event', () => {
      wrapper = find('form', element);
      expect(wrapper.length).toBe(1);

      wrapper.simulate('submit');

      expect(submitHandler).toHaveBeenCalled();
    });

    it('never cause side-effect on "click" event', () => {
      wrapper = find('input', element);
      expect(wrapper.length).toBe(3);

      wrapper.simulate('click');

      expect((wrapper.get(0) as HTMLInputElement).checked).toBe(false);
      expect((wrapper.get(1) as HTMLInputElement).checked).toBe(true);
      expect((wrapper.get(2) as HTMLInputElement).checked).toBe(false);
    });

    it('return nothing', () => {
      // single
      expect(find('form', element).simulate('submit')).toBeUndefined();

      // multiple
      expect(find('input', element).simulate('click')).toBeUndefined();
    });
  });
});
