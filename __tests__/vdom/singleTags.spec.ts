import { TagInstance, VirtualChild, VirtualElement } from '../../src/index';
import setupTags from '../tags/setupTags';
import {
  staticTag,
  tagWithOpts,
  tagWithParent,
  tagWithTags,
  tagWithEachAndTags,
} from '../tags/singleTags';

describe('vdom', () => {
  describe('staticTag', () => {
    let rootTag: TagInstance;

    setupTags(staticTag, 'static', (tag) => {
      rootTag = tag;
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

      const child = rootTag.root!.children[0] as VirtualElement;

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

    setupTags(tagWithOpts, 'tag', rootOpts, (tag) => {
      rootTag = tag;
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

      const child = rootTag.root!.children[0] as VirtualElement;

      expect(child).toHaveProperty('name', 'p');
      expect(child).not.toHaveProperty('opts');
      expect(child.attributes).toEqual({});
      expect(child.children).toHaveLength(1);
      expect(child.children[0]).toBe('Hello, world!');
    });
  });

  describe('tagWithParent', () => {
    const rootOpts = {};
    let rootTag: TagInstance<{}>;
    setupTags(tagWithParent, 'tag', rootOpts, (tag) => {
      rootTag = tag;
      // Mock parent
      (rootTag as any).parent = {
        opts: {
          data: 'Hello, world!',
        },
      };
    });

    it('render data via parent', () => {
      expect(rootTag.root!.children).toHaveLength(1);

      const tag2 = rootTag.root!.children[0] as VirtualElement;
      expect(tag2).toHaveProperty('name', 'tag2');

      const p = tag2.children.find(x => (x as any).name === 'p') as VirtualElement;
      expect(p).toBeDefined();
      expect(p).toHaveProperty('name', 'p');
      expect(p!.children.join('')).toEqual('Hello, world!');
    });
  });

  describe('tagWithTags', () => {
    let rootTag: TagInstance;

    setupTags(tagWithTags, 'tag', (tag) => {
      rootTag = tag;
    });

    it('has one tag2 in tags', () => {
      expect(rootTag.tags).toBeDefined();

      expect(rootTag.tags.tag2).toBeDefined();
      expect((rootTag.tags.tag2 as any).name).toBe('tag2');
    });

    it('has no tag itself in tags', () => {
      expect(rootTag.tags).toBeDefined();
      expect(rootTag.tags.tag).not.toBeDefined();
    });

    it('has two tag3\'s in tags', () => {
      expect(rootTag.tags).toBeDefined();
      expect(rootTag.tags.tag3).toBeDefined();
      // tslint:disable-next-line:no-magic-numbers
      expect(rootTag.tags.tag3).toHaveLength(2);
    });
  });

  describe('tagWithEachAndTags', () => {
    const rootOpts = { items: ['a', 'b', 'c'] };
    let rootTag: TagInstance;

    setupTags(tagWithEachAndTags, 'tag', rootOpts, (tag) => {
      rootTag = tag;
    });

    it('should have 3 p\'s', () => {
      expect(rootTag.root).toBeDefined();
      expect(rootTag.root!.children).toHaveLength(rootOpts.items.length);
    });

    it('should have 3 tag2\'s', () => {
      expect(rootTag.tags.tag2).toBeDefined();
      expect(rootTag.root!.children).toHaveLength(rootOpts.items.length);
      expect(rootTag.tags.tag2).toHaveLength(rootOpts.items.length);
    });
  });
});
