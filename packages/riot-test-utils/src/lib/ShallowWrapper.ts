import { TagInstance, TagOpts, TagRefs, NestedTags } from 'riot';
import { toHTML, toJSON } from './transform';
import Simulate, { FireEvent } from './Simulate';

/**
 * Wrapper of tag instance shallow-rendered.
 *
 * @see shallow
 */
export default class ShallowWrapper<
  TOpts extends TagOpts = TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
> {
  /**
   * Constructor
   *
   * @param tagInstance - tag instance to wrap
   */
  constructor(private tagInstance: TagInstance) {}

  /** Get tag instance */
  instance() {
    return this.tagInstance;
  }

  /** Get the root element */
  root() {
    return this.tagInstance.root;
  }

  /**
   * Get opts of the instance.
   * It is typically passed opts with "dataIs" property
   *
   * @param {string=} name name of the property to get
   * @returns {Object} opts if name is not specified
   * @returns {T} value of opts if name specified
   * @template T
   */
  opts(): TOpts;
  opts<T>(name: string): T;
  opts(name?: string) {
    const opts = this.tagInstance.opts;
    if (name === undefined) {
      return opts as TOpts;
    } else {
      return opts[name];
    }
  }

  /** Get refs of the instance */
  refs(): TRefs {
    return this.tagInstance.refs as TRefs;
  }

  /** Get tags */
  tags(): TTags {
    return this.tagInstance.tags as TTags;
  }

  /** Unmount tag */
  unmount() {
    this.tagInstance.unmount(); // keepTheParent is always false
  }

  /** Get outer-HTML string */
  html() {
    const root = this.tagInstance.root;
    return root !== undefined ? toHTML(root) : '';
  }

  toJSON(): object | null {
    const root = this.tagInstance.root;
    return toJSON(root !== undefined ? (root as any) : null);
  }

  /**
   * Simulate firing an event
   *
   * @param type event type
   * @param options options to override event object
   */
  simulate<T extends {}>(type: string, options?: T) {
    return (Simulate as any as { [type: string]: FireEvent })[type](this.instance().root, options);
  }
}
