import { TagInstance } from '../../src';
import setupTags from '../helpers/setupTags';
import {
  staticTag,
  tagWithOpts,
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
      expect(root.tagName.toLowerCase()).toBe('static');
      expect(root.attributes).toHaveLength(1);
      expect(root.getAttribute('data-is')).toBe('static');
    });

    it('has one child of <p>', () => {
      expect(rootTag.root!.children).toHaveLength(1);

      const child = rootTag.root!.children[0];

      expect(child.tagName.toLowerCase()).toBe('p');
      expect(child).not.toHaveProperty('opts');
      expect(child.attributes).toHaveLength(0);
      expect(child.textContent).toBe('Hello, world!');
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
      expect(root.tagName.toLowerCase()).toBe('tag');
      expect(root.attributes).toHaveLength(1);
      expect(root.getAttribute('data-is')).toBe('tag');
    });

    it('has one child of <p>', () => {
      expect(rootTag.root!.children).toHaveLength(1);

      const child = rootTag.root!.children[0];

      expect(child.tagName.toLowerCase()).toBe('p');
      expect(child).not.toHaveProperty('opts');
      expect(child.attributes).toHaveLength(0);
      expect(child.textContent).toBe('Hello, world!');
    });
  });

  describe('tagWithIf exists', () => {
    const rootOpts = { exists: true };
    let rootTag: TagInstance;
    setupTags(tagWithIf, 'tag', rootOpts, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(rootTag.root!);

      expect(childElements).toHaveLength(1);
      expect(childElements[0].tagName.toLowerCase()).toBe('div');
    });
  });

  describe('tagWithIf not exists', () => {
    const rootOpts = { exists: false };
    let rootTag: TagInstance;
    setupTags(tagWithIf, 'tag', rootOpts, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(rootTag.root!);

      expect(childElements).toHaveLength(0);
    });
  });

  describe('tagWithIfNested exists', () => {
    let rootTag: TagInstance;
    setupTags(tagWithIfNested, 'tag', { exists: true }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren(rootTag.root!);

      expect(childElements).toHaveLength(1);
      expect(childElements[0].tagName.toLowerCase()).toBe('div');
      const childChildElements = getNonEmptyChildren(childElements[0]);

      expect(childChildElements).toHaveLength(1);
      expect(childChildElements[0].tagName.toLowerCase()).toBe('p');
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
      const childElements = getNonEmptyChildren(rootTag.root!);

      expect(childElements).toHaveLength(1);
      expect(childElements[0].tagName.toLowerCase()).toBe('div');
      const childChildElements = getNonEmptyChildren(childElements[0]);

      expect(childChildElements).toHaveLength(0);
    });
  });

  describe('tagWithShow visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithShow, 'tag', { visible: true }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren<HTMLElement>(rootTag.root!);

      expect(childElements).toHaveLength(1);
      expect(childElements[0].style).toHaveProperty('display', '');
    });
  });

  describe('tagWithShow not visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithShow, 'tag', { visible: false }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren<HTMLElement>(rootTag.root!);

      expect(childElements).toHaveLength(1);
      expect(childElements[0].style).toHaveProperty('display', 'none');
    });
  });

  describe('tagWithHide visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithHide, 'tag', { visible: true }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren<HTMLElement>(rootTag.root!);

      expect(childElements).toHaveLength(1);
      expect(childElements[0].style).toHaveProperty('display', '');
    });
  });

  describe('tagWithHide not visible', () => {
    let rootTag: TagInstance;
    setupTags(tagWithHide, 'tag', { visible: false }, tag => (rootTag = tag));

    it('should render tree', () => {
      expect(rootTag.root).toBeDefined();
      const childElements = getNonEmptyChildren<HTMLElement>(rootTag.root!);

      expect(childElements).toHaveLength(1);
      expect(childElements[0].style).toHaveProperty('display', 'none');
    });
  });
});

function getNonEmptyChildren<T extends Element>(el: Element) {
  const result: T[] = [];
  for (let i = 0; i < el.children.length; i += 1) {
    const x = el.children.item(i);
    if (
      x.nodeType !== x.TEXT_NODE ||
      !isString(x.nodeValue) ||
      !/^\s*$/.test(x.nodeValue)
    ) {
      result.push(x as T);
    }
  }
  return result;
}
