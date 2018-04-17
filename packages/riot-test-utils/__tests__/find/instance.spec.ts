import { find } from '../../src';

describe('find', () => {
  describe('instance', () => {
    it('returns null when it has single result', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p>Hello!</p>';
      const wrapper = find('p', element);
      expect(wrapper.instance).toBeNull();
    });

    it('returns null when it has multiple results', () => {
      const element = document.createElement('div');
      element.innerHTML = '<p></p><p></p>';
      const wrapper = find('p', element);
      expect(wrapper.instance).toBeNull();
    });

    it('returns null when it has no result', () => {
      const element = document.createElement('div');
      element.innerHTML = '';
      const wrapper = find('p', element);
      expect(wrapper.instance).toBeNull();
    });
  });
});
