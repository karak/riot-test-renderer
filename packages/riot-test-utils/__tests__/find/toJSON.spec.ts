import { find, WeakWrapper } from '../../src';

describe('find', () => {
  describe('toJSON', () => {
    let element: HTMLDivElement;
    let wrapper: WeakWrapper;

    beforeEach(() => {
      element = document.createElement('div');
      element.innerHTML = `
        <div id="root">
          <h1>Snapshot</h1>
          <ul>
          <li class="active">Apple</li>
          <li><a href="#">Orange</a></li>
          </ul>
        </div>
      `;
    });

    afterEach(() => {
      (wrapper as any) = null;
      element.innerHTML = '';
    });

    it('get concatnated text', () => {
      wrapper = find('#root', element);
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('output as array if multiple', () => {
      wrapper = find('li', element);
      expect(() => wrapper.toJSON()).not.toThrowError();
      expect(wrapper.toJSON()).toMatchSnapshot();
    });

    it('output empty array if empty', () => {
      wrapper = find('#nowhere', element);
      expect(() => wrapper.toJSON()).not.toThrowError();
      expect(wrapper.toJSON()).toEqual([]);
    });
  });
});
