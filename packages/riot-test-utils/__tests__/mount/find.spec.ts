import { mount, RiotWrapper } from '../../src';
import { nestedStaticTag } from 'riot-test-renderer-shared/tags/multiTags';

describe('mount', () => {
  describe('find', () => {
    let wrapper: RiotWrapper;
    beforeEach(() => {
      wrapper = mount(nestedStaticTag, 'outer');
    });

    it('finds nested tag', () => {
      const inner = wrapper.find('inner');

      expect(inner.length).toBe(1);
      expect(inner.get(0).tagName.toLowerCase()).toBe('inner');
    });

    it('finds children of nested tag', () => {
      const p = wrapper.find('p');

      expect(p.length).toBe(1);
    });
  });
});
