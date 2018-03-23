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

type TagChild<UOpts = {}> =
  CustomTagInstance<{}, UOpts> | BuiltinTagInstance<UOpts> | string;

function createChildTag<UOpts>(
  document: VirtualDocument,
  parent: CustomTagInstance<UOpts>,
  tagNode: TagNode,
): TagChild<UOpts> {
  switch (tagNode.type) {
    case 'text':
      return tagNode.text;
    case 'element':
      const isCustomTag = document.getTagKind(tagNode.name).custom;
      if (isCustomTag) {
        const opts = tagNode.attributes;
        return new CustomTagInstance<{}, UOpts>(
          document,
          parent,
          tagNode,
          (opts as any),
          emptyFn);
      }
      return new BuiltinTagInstance<UOpts>(
        document,
        parent,
        tagNode,
      );
    default:
      throw new Error('Invalid type');
  }
}

export default abstract class TagInstance<UOpts = {}> {
  abstract readonly parent: TagInstance<UOpts> | null;
  abstract root?: VirtualElement;
  abstract mount(): void;
  abstract unmount(): void;
}

export function createTag<TOpts = {}, UOpts = {}>(
  document: VirtualDocument,
  rootTagNode: TagElement,
  opts: TOpts | undefined,
  scriptFn: () => void,
): TagInstance<UOpts> {
  return new CustomTagInstance<TOpts, UOpts>(document, null, rootTagNode, opts, scriptFn);
}

function renderAttributes(
  document: VirtualDocument,
  attributes: { [name: string]: string },
  data: {},
): string {
  const source = map(attributes || {}, (value, key) =>
    `${escapeHTML(key)}="${escapeHTML(value)}"`).join(' ');
  const result = renderTemplate(source, data);
  return result;
}

function makeCreateElement<TOpts extends {}, UOpts extends {}>(
  document: VirtualDocument,
  data: CustomTagInstance<TOpts, UOpts>,
) {
  return function createElement(
    this: CustomTagInstance<TOpts, UOpts> | BuiltinTagInstance<UOpts>,
  ): VirtualElement {
    const children = map(this.children, (x) => {
      if (isString(x)) {
        // Case Text node
        const rendered = renderTemplate(x, this);
        if (isString(rendered)) {
          return document.createTextNode(rendered);
        }
        return document.createTextNode(rendered === undefined ? '' : `${rendered}`);
      }
      if (x instanceof CustomTagInstance || x instanceof BuiltinTagInstance) {
        return createElement.apply(x) as VirtualElement;
      }
      throw new Error(`Unknown type: ${x}`);
    });

    const attributes = renderAttributes(document, this.attributes, this.parent || {});

    return document.createElement(this.name, attributes, children);
  };
}

/**
 * Tag instance of `riot`
 *
 * Representation of instanciated in one element of DOM.
 *
 * @see VirtualElement
 */
class CustomTagInstance<TOpts = {}, UOpts = {}> extends TagInstance<UOpts> {
  public readonly name: string;
  public isMounted = false;
  public root?: VirtualElement;

  /** Nested tags. Always empty. This is only for compatibility of real instance */
  public tags: ReadonlyArray<CustomTagInstance<{}>> = [];
  public readonly attributes: { [name: string]: string };
  public children: ReadonlyArray<TagChild>;
  private readonly render: (this: CustomTagInstance<TOpts, UOpts>) => VirtualElement;

  constructor(
    document: VirtualDocument,
    public readonly parent: CustomTagInstance<UOpts> | null,
    rootTagNode: TagElement,
    public readonly opts: TOpts | undefined,
    scriptFn: () => void,
  ) {
    super();

    // mixin riot.Observable
    observable(this);

    this.name = rootTagNode.name;
    this.attributes = rootTagNode.attributes;

    this.children = map(rootTagNode.children, childTagNode =>
      createChildTag(document, this as any as CustomTagInstance, childTagNode));

    this.render = makeCreateElement<TOpts, UOpts>(document, this);

    // execute the script section.
    scriptFn.apply(this);
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
      forEach(this.children, (x) => {
        if (!isString(x)) {
          x.unmount();
        }
      });
    } finally {
      delete this.root;
      this.isMounted = false;
    }
    // TODO: this.trigger('unmounted');
    // TODO: and this.off('*');
  }
}

class BuiltinTagInstance<UOpts extends {} = {}> extends TagInstance<UOpts>{
  public readonly name: string;
  public readonly attributes: { [name: string]: string };
  public readonly children: ReadonlyArray<TagChild<UOpts>>;
  private isMounted = false;
  public root?: VirtualElement;
  public readonly render: (this: BuiltinTagInstance<UOpts>) => VirtualElement;

  constructor(
    document: VirtualDocument,
    public readonly parent: CustomTagInstance<UOpts, {}>,
    tagNode: TagElement,
  ) {
    super();

    this.name = tagNode.name;
    this.attributes = tagNode.attributes;
    this.children = map(tagNode.children, childTagNode =>
      createChildTag(document, parent, childTagNode));
    this.render = makeCreateElement<UOpts, {}>(document, parent);
  }

  mount() {
    if (this.isMounted) return;
    try {
      forEach(this.children, (x) => {
        if (!isString(x)) {
          x.mount();
        }
      });
      this.root = this.render();
    } finally {
      this.isMounted = true;
    }
  }

  unmount() {
    if (!this.isMounted) return;

    try {
      forEach(this.children, (x) => {
        if (!isString(x)) {
          x.unmount();
        }
      });
    } finally {
      delete this.root;
      this.isMounted = false;
    }
  }
}
