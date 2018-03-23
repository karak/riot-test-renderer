import { compile } from 'riot-compiler';
import TagMap from './TagMap';
import EvalContext from './EvalContext';
import TagInstance from './TagInstance';
import VirtualElement from './VirtualElement';
import VirtualElementInternal from './VirtualElementInternal';
import VirtualTextNode from './VirtualTextNode';
import parseTag, { TagNode, TagTextNode, TagElement } from './parseTag';
import htmlTags from '../utils/htmlTags';
export type TagKind = { custom: false } | { custom: true; registered: boolean; };

/** Top-level Virtual DOM object */
export default class VirtualDocument {
  public readonly tags: TagMap = {};

  constructor(private context: EvalContext) {}

  loadTags(source: string) {
    const tagCompiled = compile(source);
    const { tags, names } = this.context.evalTag(tagCompiled);

    Object.assign(this.tags, tags);

    // TODO: Handle <style> like real `styleManager`
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

  createTag<TOpts>(name: string, opts?: TOpts): TagInstance<TOpts> {
    if (!(name in this.tags)) throw new Error(`Tag "${name} not found`);

    const args = this.tags[name];

    // tslint:disable-next-line:no-magic-numbers
    const template = args[1];
    // tslint:disable-next-line:no-magic-numbers
    const attributes = args[3];
    // tslint:disable-next-line:no-magic-numbers
    const fn = args[4];

    const rootTagNode = parseTag(name, attributes, template); // TODO: cache

    return new TagInstance<TOpts>(this, null, rootTagNode, opts, fn);
  }

  createElement(name: string, attributes: string | undefined, children: VirtualElement[]) {
    return new VirtualElementInternal(this, name, attributes, children);
  }

  createTextNode(textContent: string) {
    return new VirtualTextNode(this, textContent);
  }
}
