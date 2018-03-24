import {
  observable,
  ObservableCallback,
  Tag,
} from 'riot';
import TagArgs from './TagArgs';
import { TagNode, TagTextNode, TagElement } from './parseTag';
import VirtualDocument from './VirtualDocument';
import { VirtualElement, VirtualChild } from './VirtualElement';
import renderTemplate from './renderTemplate';
import isString from 'lodash/isString';
import map from 'lodash/map';
import escapeHTML from '../utils/escapeHTML';
import emptyFn from '../utils/emptyFn';
import mapObject from '../utils/mapObject';

export default abstract class TagInstance<UOpts = {}> {
  abstract readonly name: string;
  abstract readonly parent: TagInstance<UOpts> | null;
  abstract opts?: { [name: string]: any };
  abstract isMounted: boolean;
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

function expand<TOpts>
  (document: VirtualDocument, tagNode: TagTextNode, data?: TagInstance<TOpts>): string;
function expand<TOpts>
  (document: VirtualDocument, tagNode: TagElement, data?: TagInstance<TOpts>): VirtualElement;
function expand<TOpts>
  (document: VirtualDocument, tagNode: TagNode, data?: TagInstance<TOpts>): VirtualChild;
function expand<TOpts>
  (document: VirtualDocument, tagNode: TagNode, data?: TagInstance<TOpts>): VirtualChild {
  switch (tagNode.type) {
    case 'text':
      return expandText(document, tagNode, data);
    case 'element':
      return expandElement(document, tagNode, data);
    default:
      throw new Error('Unknown type');
  }
}

function expandText<TOpts>(
  document: VirtualDocument,
  tagNode: TagTextNode,
  data?: TagInstance<TOpts>,
) {
  const rendered = renderTemplate(tagNode.text, data);

  return `${rendered !== undefined? rendered : ''}`;
}

class PsuedoTagInstance<TOpts = {}, UOpts = {}> extends TagInstance<TOpts> {
  public readonly refs: { [name: string]: VirtualElement } = {};
  public readonly tags: { [name: string]: TagInstance } = {};
  // TODO: public root?: VirtualElement;

  constructor(
    public name: string,
    public opts: TOpts,
    public root: VirtualElement,
    public parent: TagInstance<UOpts>,
  ) {
    super();
  }

  public readonly isMounted = true;
  // tslint:disable-next-line:no-empty
  public mount(): void {}
  // tslint:disable-next-line:no-empty
  public unmount(): void {}
}

function expandElement<TOpts>(
  document: VirtualDocument,
  tagNode: TagElement,
  data?: TagInstance<TOpts>,
) {
  const isCustomTag = document.getTagKind(tagNode.name).custom;
  const isRoot = tagNode.parent === null;
  const renderedAttrs = mapObject(tagNode.attributes, (value, key) => renderTemplate(value, data));
  // Nested custom tags uses psuedo TagInstance from attrs.
  const element = document.createElement(tagNode.name, renderedAttrs || {}, []);
  const childData = isCustomTag && !isRoot?
    (new PsuedoTagInstance<{}, TOpts>(tagNode.name, renderedAttrs, element, data!)) : data;
  const children = map(tagNode.children, x => expand(document, x, childData));
  element.children.push(...children);
  return element;
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
  private render: () => VirtualElement; // shallow render

  /** Nested tags. Always empty. This is only for compatibility of real instance */
  public tags: ReadonlyArray<CustomTagInstance<{}>> = [];

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

    // execute the script section.
    scriptFn.apply(this);

    this.render = () => expand(document, rootTagNode, this);
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
}
