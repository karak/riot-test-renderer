import { TagInstance } from '../../src/vdom';
import setupTags from '../helpers/setupTags';
import {
  tagWithParent,
  tagWithTags,
  tagWithEachAndTags,
} from 'riot-test-renderer-shared/tags/multiTags';

describe('vdom', () => {
  describe('tagWithParent', () => {
    const rootOpts = { data: 'Hello, world!' };
    let rootTag: TagInstance;
    setupTags(tagWithParent, 'tag', rootOpts, tag => {
      rootTag = tag;
    });

    it('render data via parent', () => {
      expect(rootTag.root!.children).toHaveLength(1);

      const tag2 = rootTag.root!.children[0];
      expect(tag2.tagName.toLowerCase()).toBe('tag2');

      const p = tag2.querySelector('p');
      expect(p).toBeDefined();
      expect(p!.tagName.toLowerCase()).toBe('p');
      expect(p!.textContent).toBe('Hello, world!');
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
      expect(
        (rootTag.tags.tag2 as TagInstance).root.tagName.toLowerCase()
      ).toBe('tag2');
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
      expect(rootTag.tags.tag2).toHaveLength(rootOpts.items.length);
    });
  });
});
