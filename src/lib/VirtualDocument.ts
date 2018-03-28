import { compile } from 'riot-compiler';
import EvalContext from './EvalContext';
import { VirtualElement, VirtualChild } from './VirtualElement';
import parseTag, { TagElement } from './parseTag';
import htmlTags from '../utils/htmlTags';
import assign from 'lodash/assign';
import mapObject from '../utils/mapObject';

export type TagKind = { custom: false } | { custom: true; registered: boolean };

/** Objectified tag definition */
export interface RiotTag {
  type: TagElement;
  fn: () => void;
}

/** Top-level Virtual DOM object */
export default class VirtualDocument {
  private readonly tags: { [name: string]: RiotTag } = {};

  constructor(private context: EvalContext) { }

  /**
   * Load tag(s)
   *
   * @param source tag sources
   * @returns list of loaded tags in this method.
   */
  loadTags(source: string): string[] {
    const tagCompiled = compile(source);
    const { tags, names } = this.context.evalTag(tagCompiled);

    const parsedTags = mapObject(tags, (args, name) => {
      // tslint:disable-next-line:no-magic-numbers
      const template = args[1];
      // tslint:disable-next-line:no-magic-numbers
      const attributes = args[3];
      // tslint:disable-next-line:no-magic-numbers
      const fn = args[4];

      const rootTagNode = parseTag(name, attributes, template);
      return { type: rootTagNode, fn } as RiotTag;
    });
    // TODO: lazy parsing until lookup

    // TODO: Handle <style> like real `styleManager`

    assign(this.tags, parsedTags);

    return names;
  }

  /** Decide tag is custom? */
  getTagKind(name: string): TagKind {
    if (name in this.tags) {
      return { custom: true, registered: true };
    }

    if (htmlTags.indexOf(name) === -1) {
      return { custom: true, registered: false };
    }

    return { custom: false };
  }

  createTagElement(name: string): RiotTag {
    const tag = this.tags[name];

    if (tag === undefined)
      throw new Error(`Tag <${name}> must have been loaded in loadTags()`);

    return tag;
  }

  createElement(
    name: string,
    attributes: { [name: string]: any },
    children: ReadonlyArray<VirtualChild>
  ) {
    return { name, attributes, children } as VirtualElement;
  }
}
