import { shallow, ShallowWrapper } from '../src';
import {
  nestedStaticTag,
  nestedTag,
} from 'riot-test-renderer-shared/tags/multiTags';

describe('enzyme-riot-adapter', () => {
  describe('multiTags', () => {
    describe('template', () => {
      xit('does extract nested tag', () => {
        const wrapper = shallow(nestedStaticTag, 'outer');

        expect(wrapper.html()).toBe('<outer><inner><p></p></inner></outer>');
        // NOTE: Self-closing tags should always be extracted.
      });

      xit('does extract nested tag with passed attributes', () => {
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
