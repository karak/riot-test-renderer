import { shallow, ShallowWrapper } from '../../src/enzyme/index';
import {
  nestedStaticTag,
  nestedTag,
} from '../tags/multiTags';

describe('enzyme-riot-adapter', () => {
  describe('multiTags', () => {
    describe('template', () => {
      it('does extract nested tag', () => {
        const wrapper = shallow(nestedStaticTag, 'outer');

        expect(wrapper.html()).toBe('<outer><inner><p></p></inner></outer>');
        // NOTE: Self-closing tags should always be extracted.
      });

      it('does extract nested tag with passed attributes', () => {
        const wrapper = shallow(nestedStaticTag, 'outer', { innerData: 'DATA' });

        expect(wrapper.html()).toBe('<outer><inner>DATA</inner></outer>');
      });
    });
  });
});
