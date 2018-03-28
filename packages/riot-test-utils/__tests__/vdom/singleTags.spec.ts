import { TagInstance, VirtualElement } from '../../src';
import setupTags from '../helpers/setupTags';
import {
  staticTag,
  tagWithOpts,
  tagWithParent,
  tagWithTags,
  tagWithEachAndTags,
  tagWithIf,
  tagWithShow,
  tagWithHide,
  tagWithIfNested,
} from 'riot-test-renderer-shared/tags/singleTags';
import isString from 'lodash/isString';

describe('vdom', () => {
  describe('staticTag', () => {
    let rootTag: TagInstance;

    setupTags(staticTag, 'static', tag => {
      rootTag = tag;
    });

    it('should be created', () => {
      expect(rootTag).toBeDefined();
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

    setupTags(tagWithOpts, 'tag', rootOpts, tag => {
      rootTag = tag;
    });

    it('should be created', () => {
      expect(rootTag).toBeDefined();
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
    setupTags(tagWithParent, 'tag', rootOpts, tag => {
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

      const p = tag2.children.find(
        x => (x as any).name === 'p'
      ) as VirtualElement;
      expect(p).toBeDefined();
      expect(p).toHaveProperty('name', 'p');
      expect(p!.children.join('')).toEqual('Hello, world!');
    });
  });

  describe('tagWithTags', () => {
    let rootTag: TagInstance;

    setupTags(tagWithTags, 'tag', tag => {
      rootTag = tag;
    });

    it('has one tag2 in tags', () => {
      expect(rootTag.tags).toBeDefined();

      expect(rootTag.tags.tag2).toBeDefined();
      expect((rootTag.tags.tag2 as TagInstance).root!.name).toBe('tag2');
    });

    it('has no tag itself in tags', () => {
      expect(rootTag.tags).toBeDefined();
      expect(rootTag.tags.tag).not.toBeDefined();
    });

    it("has two tag3's in tags", () => {
      expect(rootTag.tags).toBeDefined();
      expect(rootTag.tags.tag3).toBeDefined();
      // tslint:disable-next-line:no-magic-numbers
      expect(rootTag.tags.tag3).toHaveLength(2);
    });
  });

  describe('tagWithEachAndTags', () => {
    const rootOpts = { items: ['a', 'b', 'c'] };
    let rootTag: TagInstance;

    setupTags(tagWithEachAndTags, 'tag', rootOpts, tag => {
      rootTag = tag;
    });

    it("should have 3 p's", () => {
      expect(rootTag.root).toBeDefined();
      expect(rootTag.root!.children).toHaveLength(rootOpts.items.length);
    });

    it("should have 3 tag2's", () => {
      expect(rootTag.tags.tag2).toBeDefined();
      expect(rootTag.root!.children).toHaveLength(rootOpts.items.length);
      expect(rootTag.tags.tag2).toHaveLength(rootOpts.items.length);
    });
  });

  describe('tagWithIf exists', () => {
    const rootOpts = { exists: true };
    let rootTag: TagInstance;
    setupTags(tagWithIf, 'tag', rootOpts, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(1);
      expect(childElements[0].name).toBe('tag2');
    });
  });

  describe('tagWithIf not exists', () => {
    const rootOpts = { exists: false };
    let rootTag: TagInstance;
    setupTags(tagWithIf, 'tag', rootOpts, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(0);
    });
  });

  describe('tagWithIfNested exists', () => {
    let rootTag: TagInstance;
    setupTags(tagWithIfNested, 'tag', { exists: true }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(1);
      expect(childElements[0].name).toBe('div');
      const childChildElements = getNonEmptyChildren(
        childElements[0]
      ) as VirtualElement[];

      expect(childChildElements).toHaveLength(1);
      expect(childChildElements[0].name).toBe('p');
    });
  });

  describe('tagWithIfNested exists', () => {
    let rootTag: TagInstance;
    setupTags(
      tagWithIfNested,
      'tag',
      { exists: false },
      tag => (rootTag = tag)
    );

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(1);
      expect(childElements[0].name).toBe('div');
      const childChildElements = getNonEmptyChildren(
        childElements[0]
      ) as VirtualElement[];

      expect(childChildElements).toHaveLength(0);
    });
  });

  describe('tagWithShow visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithShow, 'tag', { visible: true }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(1);
      expect(childElements[0].attributes).toHaveProperty('style', {
        display: '',
      });
    });
  });

  describe('tagWithShow not visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithShow, 'tag', { visible: false }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(1);
      expect(childElements[0].attributes).toHaveProperty('style', {
        display: 'none',
      });
    });
  });

  describe('tagWithHide visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithHide, 'tag', { visible: true }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(1);
      expect(childElements[0].attributes).toHaveProperty('style', {
        display: '',
      });
    });
  });

  describe('tagWithHide not visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithHide, 'tag', { visible: false }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(
        rootTag.root!
      ) as VirtualElement[];

      expect(childElements).toHaveLength(1);
      expect(childElements[0].attributes).toHaveProperty('style', {
        display: 'none',
      });
    });
  });
});

function getNonEmptyChildren(el: VirtualElement) {
  return el.children.filter(x => !isString(x) || !/^\s*$/.test(x));
}
