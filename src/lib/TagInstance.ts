import {
  observable,
  ObservableCallback,
  Tag,
} from 'riot';
import TagArgs from './TagArgs';
import { TagNode, TagTextNode, TagElement } from './parseTag';
import VirtualDocument from './VirtualDocument';
import VirtualElement from './VirtualElement';
import VirtualElementInternal from './VirtualElementInternal';
import renderTemplate from './renderTemplate';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import isString from 'lodash/isString';
import escapeHTML from '../utils/escapeHTML';
import emptyFn from '../utils/emptyFn';

function createChildTag<TOpts, UOpts>(
  document: VirtualDocument,
  parent: TagInstance<UOpts> | null,
  tagNode: TagNode,
): TagInstance<TOpts> | string {
  switch (tagNode.type) {
    case 'text':
      return tagNode.text;
    case 'element':
      const isCustomTag = document.getTagKind(tagNode.name).custom;
      const opts = isCustomTag? tagNode.attributes : (parent && parent.opts) || undefined;
      return new TagInstance<TOpts, UOpts>(document, parent, tagNode, opts as any, emptyFn);
    default:
      throw new Error('Invalid type');
  }
}

/**
 * Tag instance of `riot`
 *
 * Representation of instanciated in one element of DOM.
 *
 * @see VirtualElement
 */
export default class TagInstance<TOpts = {}, UOpts = {}> {
  public readonly name: string;
  public isMounted = false;
  public root?: VirtualElement;

  /** Nested tags. Always empty. This is only for compatibility of real instance */
  public tags: ReadonlyArray<TagInstance<{}>> = [];
  private children: ReadonlyArray<TagInstance | string>;
  private readonly render: (this: TagInstance<TOpts>) => VirtualElement;

  constructor(
    document: VirtualDocument,
    public readonly parent: TagInstance<UOpts> | null,
    rootTagNode: TagElement,
    public readonly opts: TOpts | undefined,
    scriptFn: () => void,
  ) {
    // mixin riot.Observable
    observable(this);

    this.name = rootTagNode.name;

    this.children = map(rootTagNode.children, childTagNode =>
      createChildTag(document, this as any as TagInstance, childTagNode));

    this.render = TagInstance.makeCreateElement<TOpts>(document);

    // execute the script section.
    scriptFn.apply(this);
  }

  static makeCreateElement<TOpts extends Object>(document: VirtualDocument) {
    return function createElement(this: TagInstance<TOpts>): VirtualElement {
      const children = map(this.children, (x) => {
        if (isString(x)) {
          // Case Text node
          const rendered = renderTemplate(x, this);
          if (isString(rendered)) {
            return document.createTextNode(rendered);
          }
          return document.createTextNode(rendered === undefined ? '' : `${rendered}`);
        }
        if (x instanceof TagInstance) {
          // Case: HTML tag or cutom tag
          return createElement.apply(x) as VirtualElement;
        }
        throw new Error(`Unknown type: ${x}`);
      });

      const attributeTemplate = map(this.attributes, (key, value) =>
        `${escapeHTML(key)}="${escapeHTML(value)}"`).join(' ');
      const attributes = this.opts !== undefined? renderTemplate(attributeTemplate, this) : '';

      return document.createElement(this.name, attributes, children);
    };
  }

  /** Dummy functions for type definitions, which is realized by `riot.observable()` */
  /** @inheritDoc */
  on(event: string, callback: ObservableCallback): this { return this; }
  /** @inheritDoc */
  one(event: string, callback: ObservableCallback): this { return this; }
  /** @inheritDoc */
  off(event: string, callback?: ObservableCallback): this { return this; }
  /** @inheritDoc */
  trigger(event: string, ...args: any[]): this { return this; }

  mount() {
    if (this.isMounted) return;

    forEach(this.children, (x) => {
      if (!isString(x)) {
        x.mount();
      }
    });
    this.root = this.render();
    this.isMounted = true;
    // TODO: this.trigger('mount');
    // TODO: Call this.update() after mount
  }

  // TODO: update()
  update() {
    throw new Error('Not implemented');
  }

  unmount() {
    if (!this.isMounted) return;

    try {
      // TODO: this.trigger('before-unmount');
    } finally {
      delete this.root;
      this.isMounted = false;
    }
    // TODO: this.trigger('unmounted');
    // TODO: and this.off('*');
  }

  toString() {
    return this.root !== undefined? this.root.outerHTML : `<${this.name}></${this.name}>`;
  }
}
