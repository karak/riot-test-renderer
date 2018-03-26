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
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import escapeHTML from '../utils/escapeHTML';
import emptyFn from '../utils/emptyFn';
import mapObject from '../utils/mapObject';

export default abstract class TagInstance<UOpts = {}> {
  abstract readonly name: string;
  abstract readonly parent: TagInstance<UOpts> | null;
  abstract opts?: { [name: string]: any };
  abstract tags: {
    [name: string]: TagInstance<any> | ReadonlyArray<TagInstance<any>>,
  };
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

type MeetCustomTagCallback = (tag: TagInstance<any>) => void;

function expand<TOpts>(
  document: VirtualDocument,
  tagNode: TagTextNode,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
): string;
function expand<TOpts>(
  document: VirtualDocument,
  tagNode: TagElement,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
):VirtualElement;
function expand<TOpts>(
  document: VirtualDocument,
  tagNode: TagNode,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
): VirtualChild;
function expand<TOpts>(
  document: VirtualDocument,
  tagNode: TagNode,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
): VirtualChild {
  switch (tagNode.type) {
    case 'text':
      return expandText(document, tagNode, data);
    case 'element':
      return expandElement(document, tagNode, data, onMeetCustomTag);
    default:
      throw new Error('Unknown type');
  }
}

function expandText<TOpts>(
  document: VirtualDocument,
  tagNode: TagTextNode,
  data: TagInstance<TOpts>,
) {
  const rendered = renderTemplate(tagNode.text, data);

  return `${rendered !== undefined? rendered : ''}`;
}

function expandElement<TOpts>(
  document: VirtualDocument,
  tagNode: TagElement,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
) {
  const isRoot = tagNode.parent === null;
  const isNestedCustom = !isRoot && document.getTagKind(tagNode.name).custom;
  const renderedAttrs = mapObject(tagNode.attributes, (value, key) => renderTemplate(value, data));
  const element = document.createElement(tagNode.name, renderedAttrs || {}, []);
  const children = map(tagNode.children, x => expand(document, x, data, onMeetCustomTag));
  element.children.push(...children);
  if (isNestedCustom) {
    const nestedTag = new NestedTagInstance(
      tagNode.name,
      data,
      renderedAttrs,
      {},
      element,
    );
    onMeetCustomTag(nestedTag);
  }
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

  public tags: {
    [name: string]: TagInstance<any> | Array<TagInstance<any>>,
  };

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
    this.tags = {};

    // execute the script section.
    scriptFn.apply(this);

    this.render = () => expand(document, rootTagNode, this, (nestedTag) => {
      const name = nestedTag.name;
      if (!(name in this.tags)) {
        // 1st path
        this.tags[name] = nestedTag;
      } else {
        if (!isArray(this.tags[name])) {
          // 2nd path
          (this.tags[name] as any) = [this.tags[name], nestedTag];
        } else {
          // 3rd or greater path
          (this.tags[name] as any).push(nestedTag);
        }
      }
    });
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

class NestedTagInstance<TOpts, UOpts> extends TagInstance<TOpts> {
  constructor(
    public readonly name: string,
    public readonly parent: TagInstance<UOpts> | null = null,
    public opts?: { [name: string]: any },
    public tags: {
      [name: string]: TagInstance<any> | ReadonlyArray<TagInstance<any>>,
    } = {},
    public root: VirtualElement | undefined = undefined,
  ) {
    super();
  }
  isMounted: boolean = true;
  mount(): void {}
  unmount(): void {}
}
