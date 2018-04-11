import { shallow } from '../../src';
import {
  nestedStaticTag,
  nestedTag,
} from 'riot-test-renderer-shared/tags/multiTags';

describe('shallow', () => {
  describe('multiTags', () => {
    describe('template', () => {
      it("doesn't extract nested tag", () => {
        const wrapper = shallow(nestedStaticTag, 'outer');

        expect(wrapper.html()).toBe(
          '<outer data-is="outer"><inner></inner></outer>'
        );
        // NOTE: Self-closing tags should be extracted.
      });

      it("doesn't extract nested tag but passed attributes", () => {
        const wrapper = shallow(nestedTag, 'outer', { innerData: 'DATA' });

        expect(wrapper.html()).toBe(
          '<outer data-is="outer"><inner data="DATA"></inner></outer>'
        );
      });
    });
  });
});
