import { shallow } from '../../src/index';

describe('shallow', () => {
  describe('multiTags', () => {
    describe('template', () => {
      const nestedStaticTag = `
      <inner>
        <p></p>
      </inner>
      <outer>
        <inner />
      </outer>
      `;

      const nestedTag = `
      <inner>
        <p>{opts.data}</p>
      </inner>
      <outer>
        <inner data={opts.innerData} />
      </outer>
      `;

      it('doesn\'t extract nested tag', () => {
        const wrapper = shallow(nestedStaticTag, 'outer');

        expect(wrapper.html()).toBe('<outer><inner></inner></outer>');
        // NOTE: Self-closing tags should be extracted.
      });

      it('doesn\'t extract nested tag but passed attributes', () => {
        const wrapper = shallow(nestedTag, 'outer', { innerData: 'DATA' });

        expect(wrapper.html()).toBe('<outer><inner data="DATA"></inner></outer>');
      });
    });
  });
});
