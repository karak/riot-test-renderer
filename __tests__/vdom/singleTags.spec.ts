import { loadTags, createTag, TagInstance, VirtualChild, VirtualElement } from '../../src/index';
import {
  staticTag,
  tagWithOpts,
  tagWithParent,
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
      const root = rootTag.root;
      expect(root).toBeDefined();
      expect(root).toHaveProperty('name', 'static');
      expect(root!.attributes).toEqual({});
    });

    it('has one child of <p>', () => {
      expect(rootTag.root!.children).toHaveLength(1);

      const child = rootTag.root!.children[0];

      expect(child).toHaveProperty('name', 'p');
      expect(child).not.toHaveProperty('opts');
      expect(child.attributes).toEqual({});
      expect(child.children).toHaveLength(1);
      expect(child.children[0]).toBe('Hello, world!');
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
      const root = rootTag.root;
      expect(root).toBeDefined();
      expect(root).toHaveProperty('name', 'tag');
      expect(root!.attributes).toEqual({}); // root attributes is no opts
    });

    it('has one child of <p>', () => {
      expect(rootTag.root!.children).toHaveLength(1);

      const child = rootTag.root!.children[0];

      expect(child).toHaveProperty('name', 'p');
      expect(child).not.toHaveProperty('opts');
      expect(child.attributes).toEqual({});
      expect(child.children).toHaveLength(1);
      expect(child.children[0]).toBe('Hello, world!');
    });
  });

  describe('tagWithParent', () => {
    const rootOpts = { data: 'Hello, world!' };
    let rootTag: TagInstance;

    beforeAll(() => {
      loadTags(tagWithParent);
    });

    beforeEach(() => {
      rootTag = createTag('tag', rootOpts);
      rootTag.mount();
    });

    afterEach(() => {
      rootTag.unmount();
    });

    it('render data via parent', () => {
      expect(rootTag.root!.children).toHaveLength(1);

      const tag2 = rootTag.root!.children[0];
      expect(tag2).toHaveProperty('name', 'tag2');

      const p = tag2.children.find(x => x.name === 'p');
      expect(p).toBeDefined();
      expect(p).toHaveProperty('name', 'p');
      expect(p!.children.join('')).toEqual('Hello, world!');
    });
  });
});
