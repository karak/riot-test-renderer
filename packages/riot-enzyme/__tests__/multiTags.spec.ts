import { shallow } from '../src';
import {
  nestedStaticTag,
  nestedTag,
} from 'riot-test-renderer-shared/tags/multiTags';

describe('enzyme-riot-adapter', () => {
  describe('multiTags', () => {
    describe('template', () => {
      it('does extract nested tag', () => {
        const wrapper = shallow(nestedStaticTag, 'outer');

        expect(wrapper.html()).toBe('<outer><inner><p></p></inner></outer>');
        // NOTE: Self-closing tags should always be extracted.
      });

      it('does extract nested tag with passed attributes', () => {
        const wrapper = shallow(nestedTag, 'outer', {
          innerData: 'DATA',
        });

        expect(wrapper.html()).toBe(
          '<outer><inner><p>DATA</p></inner></outer>'
        );
      });
    });
  });
});
