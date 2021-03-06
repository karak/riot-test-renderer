import { shallow } from '../../src';
import {
  staticTag,
  staticTagWithStyle,
  tagWithOpts,
  tagWithEach,
} from 'riot-test-renderer-shared/tags/singleTags';

describe('shallow', () => {
  describe('singleTags', () => {
    describe('template', () => {
      it('renders static tag', () => {
        const wrapper = shallow(staticTag);

        expect(wrapper.html()).toBe(
          '<static data-is="static"><p>Hello, world!</p></static>'
        );
        expect(wrapper.root.tagName.toLowerCase()).toBe('static');
        expect(wrapper.toJSON()).toMatchSnapshot();
      });

      it('renders ignoring style', () => {
        const wrapper = shallow(staticTagWithStyle);

        expect(wrapper.html()).toBe(
          '<static data-is="static"><p>Hello, world!</p></static>'
        );
        expect(wrapper.root.tagName.toLowerCase()).toBe('static');
        expect(wrapper.toJSON()).toMatchSnapshot();
      });

      it('extracts template', () => {
        const wrapper = shallow(tagWithOpts, { data: 'Hello, world!' });

        expect(wrapper.html()).toBe(
          '<tag data-is="tag"><p>Hello, world!</p></tag>'
        );
        expect(wrapper.root.tagName.toLowerCase()).toBe('tag');
        expect(wrapper.toJSON()).toMatchSnapshot();
      });

      it('template "each" work', () => {
        const wrapper = shallow(tagWithEach, { items: ['A', 'B', 'C'] });

        expect(wrapper.html()).toBe(
          '<tag data-is="tag"><p>A</p><p>B</p><p>C</p></tag>'
        );
        expect(wrapper.root.querySelectorAll('p')).toHaveLength(3);
        expect(wrapper.toJSON()).toMatchSnapshot();
      });

      it('escapes HTML special characters in template', () => {
        const wrapper = shallow(tagWithOpts, { data: '"&<>' });

        expect(wrapper.html()).toBe(
          '<tag data-is="tag"><p>"&amp;&lt;&gt;</p></tag>'
        );
        expect(wrapper.root.querySelector('p')!.textContent).toBe('"&<>');
        expect(wrapper.toJSON()).toMatchSnapshot();
      });
    });

    describe('script', () => {
      it('execute script section under tagInstance', () => {
        const tag = `
        <tag>
          <p></p>
          this.foo = 'HACKED';
        </tag>
        `;

        const wrapper = shallow(tag);
        expect(wrapper.instance).toHaveProperty('foo', 'HACKED');
      });

      it('look the variables from template that defined in script section', () => {
        const tag = `
        <tag>
          <p>{ foo }</p>
          this.foo = 'SET';
        </tag>
        `;

        const wrapper = shallow(tag);
        expect(wrapper.html()).toBe('<tag data-is="tag"><p>SET</p></tag>');
      });

      it('execute top-level script under some context outside tagInstance', () => {
        const tag = `
        <tag>
          <p></p>
        </tag>
        this.foo = 'HACKED';
        `;

        const wrapper = shallow(tag);
        expect(wrapper.instance).not.toHaveProperty('foo', 'HACKED');
      });
    });
  });
});
