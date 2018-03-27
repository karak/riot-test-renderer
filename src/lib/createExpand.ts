import TagInstance from './TagInstance';
import VirtualDocument from './VirtualDocument';
import { VirtualElement, VirtualChild } from './VirtualElement';
import { TagNode, TagTextNode, TagElement } from './parseTag';
import renderTemplate from './renderTemplate';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import isArray from 'lodash/isArray';
import mapObject from '../utils/mapObject';

export type MeetCustomTagCallback = <TOpts>(
  this: TagInstance<TOpts>,
  name: string,
  tag: TagInstance<any>
) => void;

function onMeetCustomTag<TOpts>(
  this: TagInstance<TOpts>,
  name: string,
  nestedTag: TagInstance<any>
) {
  // TODO: this.opts rather than embedding into rootTagNode
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
}

export interface CreateTagInstance {
  <TOpts extends {}>(
    name: string,
    opts: TOpts,
    children: ReadonlyArray<VirtualChild>
  ): TagInstance<TOpts>;
}

export default function createExpand(createTagInstance: CreateTagInstance) {
  return <TOpts>(
    document: VirtualDocument,
    tagNode: TagElement,
    data: TagInstance<TOpts>
  ) => expand(document, data, tagNode, data, createTagInstance);
}

/** Construct VDOM tree */
function expand<TOpts>(
  document: VirtualDocument,
  parent: TagInstance<TOpts>,
  tagNode: TagTextNode,
  data: any,
  createTagInstance: CreateTagInstance
): string;
function expand<TOpts>(
  document: VirtualDocument,
  parent: TagInstance<TOpts>,
  tagNode: TagElement,
  data: any,
  createTagInstance: CreateTagInstance
): VirtualElement;
function expand<TOpts>(
  document: VirtualDocument,
  parent: TagInstance<TOpts>,
  tagNode: TagNode,
  data: any,
  createTagInstance: CreateTagInstance
): VirtualChild;
function expand<TOpts>(
  document: VirtualDocument,
  parent: TagInstance<TOpts>,
  tagNode: TagNode,
  data: any,
  createTagInstance: CreateTagInstance
): VirtualChild {
  switch (tagNode.type) {
    case 'text':
      return expandText(document, tagNode, data);
    case 'element':
      return expandElement(document, parent, tagNode, data, createTagInstance);
    default:
      throw new Error('Unknown type');
  }
}

function expandText(
  document: VirtualDocument,
  tagNode: TagTextNode,
  data: any
) {
  const rendered = renderTemplate(tagNode.text, data);

  return `${rendered !== undefined ? rendered : ''}`;
}

function expandAttributes<TOpts>(
  attributes: { [name: string]: string },
  data: any
) {
  const renderedAttrs = mapObject(attributes, (value, key) =>
    renderTemplate(value, data)
  );
  const ifAttr = renderedAttrs['if'];
  const eachAttr = renderedAttrs['each'];
  const showAttr = renderedAttrs['show'];
  const hideAttr = renderedAttrs['hide'];
  delete renderedAttrs['if'];
  delete renderedAttrs['each'];
  delete renderedAttrs['show'];
  delete renderedAttrs['hide'];
  return {
    if: ifAttr,
    each: eachAttr,
    show: showAttr,
    hide: hideAttr,
    rests: renderedAttrs,
  };
}

/**
 * Render child tags upon existence of "each" attribute
 * @param each value of "each" attribute
 * @param current `this` context between {}
 * @param callback render function
 */
function forEachOrOnce<TOpts>(
  each: any[] | undefined,
  current: any,
  fn: (data: any) => void
) {
  if (each) {
    forEach(each, item => {
      fn(item);
    });
  } else {
    fn(current);
  }
}

/** Set "display" attribute after ensure existense of "style" property for CSS. */
function setDisplay(attrs: { style?: { display?: string } }, visible: boolean) {
  if (!('style' in attrs)) {
    attrs.style = {};
  }
  if (visible) {
    attrs.style!.display = '';
  } else {
    attrs.style!.display = 'none';
  }
}

/**
 * Controll rendering on "if", "each", "show" and "hide" attributes
 *
 * @param renderCurrent render body, called if needed.
 * @param renderChildren render all the children, called once or any times with "each".
 */
function expandControllAttributes<TOpts>(
  name: string,
  attributes: { [name: string]: string },
  children: ReadonlyArray<TagNode>,
  data: any,
  renderTag: (
    name: string,
    attributes: { [name: string]: string },
    children: ReadonlyArray<VirtualChild>
  ) => VirtualElement,
  expandChild: (child: TagNode, childData: any) => VirtualChild
): VirtualElement | '' {
  const renderedAtrrs = expandAttributes(attributes, data);

  // return empty string on "if" attributes
  if (renderedAtrrs.if !== undefined && !renderedAtrrs.if) {
    return '';
  }

  // set "display attribute on ""show" and "hide" attributes
  if (renderedAtrrs.show !== undefined) {
    setDisplay(renderedAtrrs.rests, renderedAtrrs.show);
  } else if (renderedAtrrs.hide !== undefined) {
    setDisplay(renderedAtrrs.rests, !renderedAtrrs.hide);
  }

  // render children on "each" attributes
  const renderedChildren: VirtualChild[] = [];
  forEachOrOnce(renderedAtrrs.each, data, childData => {
    const items = map(children, x => expandChild(x, childData));
    renderedChildren.push(...items);
  });

  // create built-in element or root of mounted instance
  const element = renderTag(name, renderedAtrrs.rests, renderedChildren);

  return element;
}

function expandElement<TOpts>(
  document: VirtualDocument,
  parent: TagInstance<TOpts>,
  tagNode: TagElement,
  data: any,
  createTagInstance: CreateTagInstance
): VirtualElement | '' {
  let nestedTag: TagInstance<any> | null = null;

  return expandControllAttributes(
    tagNode.name,
    tagNode.attributes,
    tagNode.children,
    data,
    (name, opts, children) => {
      const isRoot = tagNode.parent === null;
      const isNestedCustom =
        !isRoot && document.getTagKind(tagNode.name).custom;

      let element: VirtualElement;
      if (isNestedCustom) {
        nestedTag = createTagInstance(tagNode.name, opts, children);
        nestedTag.mount();
        onMeetCustomTag.apply(parent, [tagNode.name, nestedTag]);
        element = nestedTag.root!;
      } else {
        nestedTag = null;
        element = document.createElement(tagNode.name, opts, children);
      }
      return element;
    },
    (child, childData) =>
      expand(document, parent, child, childData, createTagInstance)
  );
}
