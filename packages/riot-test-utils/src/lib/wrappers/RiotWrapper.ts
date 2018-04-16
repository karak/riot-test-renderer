import {
  TagInstance,
  TagInterface,
  TagOpts,
  TagRefs,
  NestedTags,
  ObservableCallback,
  TagMixin,
} from 'riot';
import { toHTML, toJSON } from '../transform';
import Simulate, { FireEvent } from '../Simulate';

/**
 * Wrapper of tag instance shallow-rendered.
 *
 * @see shallow
 */
export default class RiotWrapper<
  TOpts extends TagOpts = TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
> implements TagInterface {
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

  /**
   * Parent tag being always `null`
   * Not undefined but null(type definition of riot **is** wrong.)
   */
  get parent(): TagInstance | undefined {
    return this.tagInstance.parent;
  }

  /** Update this tag and its children */
  update<T extends {}>(data?: T): void {
    this.tagInstance.update(data);
  }

  /** Is the tag mounted? */
  get isMounted() {
    return this.tagInstance.isMounted!;
  }

  /** Mount the tag */
  mount() {
    this.tagInstance.mount();
  }

  /** Unmount the tag */
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

  /** Apply mixin */
  mixin(mixin: string | TagMixin) {
    this.instance.mixin(mixin);
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
    return ((Simulate as any) as { [type: string]: FireEvent })[type](
      this.tagInstance.root,
      options
    );
  }
}
