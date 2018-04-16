import { mount } from '../../src';
import {
  nestedStaticTag,
  nestedTag,
} from 'riot-test-renderer-shared/tags/multiTags';

describe('mount', () => {
  describe('multiTags', () => {
    describe('template', () => {
      it('does extract nested tag', () => {
        const wrapper = mount(nestedStaticTag, 'outer');

        expect(wrapper.html()).toBe(
          '<outer data-is="outer"><inner><p></p></inner></outer>'
        );
      });

      it('does extract nested tag', () => {
        const wrapper = mount(nestedTag, 'outer', { innerData: 'rendered!' });

        expect(wrapper.html()).toBe(
          '<outer data-is="outer"><inner data="rendered!"><p>rendered!</p></inner></outer>'
        );
      });
    });
  });
});
