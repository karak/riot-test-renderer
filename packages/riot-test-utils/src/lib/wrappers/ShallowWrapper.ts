import { TagInstance, TagOpts, TagRefs, NestedTags, ObservableCallback } from 'riot';
import { toHTML, toJSON } from '../transform';
import Simulate, { FireEvent } from '../Simulate';

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
  constructor(private readonly tagInstance: TagInstance) {}

  /** Get tag instance */
  get instance() {
    return this.tagInstance;
  }

  /** Get the root element */
  get root() {
    return this.tagInstance.root;
  }

  /**
   * Get opts of the instance.
   * It is typically passed opts with "dataIs" property
   */
  get opts() {
    const opts = this.tagInstance.opts;
    return opts as TOpts & { dataIs: string };
  }

  /** Get refs of the instance */
  get refs(): TRefs {
    return this.tagInstance.refs as TRefs;
  }

  /** Get tags */
  get tags(): TTags {
    return this.tagInstance.tags as TTags;
  }

  /** Unmount tag */
  unmount(keepTheParent?: boolean) {
    this.tagInstance.unmount(keepTheParent);
  }

  /**
   * Register callback.
   *
   * Note: `this` is unwrapped instance as well.
   */
  on(event: string, callback: ObservableCallback): this {
    this.tagInstance.on(event, callback);
    return this;
  }


  /**
   * Register callback once.
   *
   * Note: `this` is unwrapped instance as well.
   */
  one(event: string, callback: ObservableCallback): this {
    this.tagInstance.one(event, callback);
    return this;
  }

  /**
   * Execute callbacks
   */
  trigger(event: string, ...args: any[]): this {
    this.tagInstance.trigger(event, ...args);
    return this;
  }

  /**
   * Unregister callback(s)
   */
  off(event: string, callback?: ObservableCallback): this {
    this.tagInstance.off(event, callback);
    return this;
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
    return (Simulate as any as { [type: string]: FireEvent })[type](this.tagInstance.root, options);
  }
}
