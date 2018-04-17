import { shallow, RiotWrapper } from '../../src';
import { nestedStaticTag } from 'riot-test-renderer-shared/tags/multiTags';

describe('shallow', () => {
  describe('find', () => {
    let wrapper: RiotWrapper;
    beforeEach(() => {
      wrapper = shallow(nestedStaticTag, 'outer');
    });

    it('finds nested tag', () => {
      const inner = wrapper.find('inner');

      expect(inner.length).toBe(1);
      expect(inner.get(0).tagName.toLowerCase()).toBe('inner');
    });

    it('never find children of nested tag', () => {
      const p = wrapper.find('p');

      expect(p.length).toBe(0);
    });
  });
});
