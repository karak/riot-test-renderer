import { loadTags, createTag, TagInstance } from '../../src';
import {
  staticTag,
  tagWithOpts,
} from '../tags/singleTags';

describe('vdom', () => {
  describe('staticTag', () => {
    let rootTag: TagInstance;

    beforeAll(() => {
      loadTags(staticTag);
    });

    beforeEach(() => {
      rootTag = createTag('static');
      rootTag.mount();
    });

    afterEach(() => {
      rootTag.unmount();
    });

    it('has name of "static"', () => {
      expect(rootTag).toHaveProperty('name', 'static');
    });

    it('renders after mount', () => {
      expect(rootTag.root.outerHTML).toBe('<static><p>Hello, world!</p></static>');
    });

    it('has one child of <p>', () => {
      expect(rootTag.children).toHaveLength(1);

      const childTag: TagInstance = rootTag.children[0];

      expect(childTag).toBeInstanceOf(TagInstance);
      expect(childTag).toHaveProperty('name', 'p');
      expect(childTag).not.toHaveProperty('opts');
      expect(childTag).toHaveProperty('parent', rootTag);
      expect(childTag.root.outerHTML).toBe('<p>Hello, world!</p>');
    });
  });

  describe('tagWithOpts', () => {
    const rootOpts = { data: 'Hello, world!' };
    let rootTag: TagInstance;

    beforeAll(() => {
      loadTags(tagWithOpts);
    });

    beforeEach(() => {
      rootTag = createTag('tag', rootOpts);
      rootTag.mount();
    });

    afterEach(() => {
      rootTag.unmount();
    });

    it('has name of "tag"', () => {
      expect(rootTag).toHaveProperty('name', 'tag');
    });

    it('renders after mount', () => {
      expect(rootTag.root.outerHTML).toBe('<tag><p>Hello, world!</p></tag>');
    });

    it('has one child of <p>', () => {
      expect(rootTag.children).toHaveLength(1);

      const childTag: TagInstance = rootTag.children[0];

      expect(childTag).toBeInstanceOf(TagInstance);
      expect(childTag).toHaveProperty('name', 'p');
      expect(childTag).not.toHaveProperty('opts');
      expect(childTag).toHaveProperty('parent', rootTag);
      expect(childTag.root.outerHTML).toBe('<p>Hello, world!</p>');
    });
  });
});
