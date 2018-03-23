import { compile } from 'riot-compiler';
import TagMap from './TagMap';
import EvalContext from './EvalContext';
import TagInstance from './TagInstance';
import VirtualElementInternal from './VirtualElementInternal';

/** Top-level Virtual DOM object */
export default class VirtualDocument {
  readonly tags: TagMap = {};

  constructor(private context: EvalContext) {}

  loadTags(source: string) {
    const tagCompiled = compile(source);
    const { tags } = this.context.evalTag(tagCompiled);

    Object.assign(this.tags, tags);

    // TODO: Handle <style> like real `styleManager`
  }

  createTag<TOpts>(name: string, opts?: TOpts) {
    if (!(name in this.tags)) throw new Error(`Tag "${name} not found`);

    return new TagInstance(this, this.tags[name], opts);
  }

  createElement(name: string, attributes: string | undefined, innerHTML: string) {
    return new VirtualElementInternal(this, name, attributes, innerHTML);
  }
}
