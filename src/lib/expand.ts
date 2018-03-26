import TagInstance from './TagInstance';
import VirtualDocument from './VirtualDocument';
import { VirtualElement, VirtualChild } from './VirtualElement';
import { TagNode, TagTextNode, TagElement } from './parseTag';
import renderTemplate from './renderTemplate';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import mapObject from '../utils/mapObject';

export type MeetCustomTagCallback = (tag: TagInstance<any>) => void;

/** Construct VDOM tree */
export default function expand<TOpts>(
  document: VirtualDocument,
  tagNode: TagTextNode,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
): string;
export default function expand<TOpts>(
  document: VirtualDocument,
  tagNode: TagElement,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
):VirtualElement;
export default function expand<TOpts>(
  document: VirtualDocument,
  tagNode: TagNode,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
): VirtualChild;
export default function expand<TOpts>(
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

function expandAttributes<TOpts>(
  attributes: { [name: string]: string },
  data: TagInstance<TOpts>,
) {
  const renderedAttrs = mapObject(attributes, (value, key) => renderTemplate(value, data));
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
  current: TagInstance<TOpts>,
  fn: (data: any) => void,
) {
  if (each) {
    forEach(each, (item) => {
      fn(item);
    });
  } else {
    fn(current);
  }
}

/** Set "display" attribute after ensure existense of "style" property for CSS. */
function setDisplay(attrs: { style?: { display?: string }}, visible: boolean) {
  if (!('style' in attrs)) {
    attrs.style = {};
  }
  if (visible) {
    attrs.style!.display = '';
  } else {
    attrs.style!.display = 'none';
  }
}

function expandElement<TOpts>(
  document: VirtualDocument,
  tagNode: TagElement,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
): VirtualElement | '' {
  const isRoot = tagNode.parent === null;
  const isNestedCustom = !isRoot && document.getTagKind(tagNode.name).custom;
  const renderedAtrrs = expandAttributes(tagNode.attributes, data);

  // "if" attributes
  if (renderedAtrrs.if !== undefined && !renderedAtrrs.if) {
    return '';
  }

  // "show" and "hide" attributes
  if (renderedAtrrs.show !== undefined) {
    setDisplay(renderedAtrrs.rests, renderedAtrrs.show);
  } else if (renderedAtrrs.hide !== undefined) {
    setDisplay(renderedAtrrs.rests, !renderedAtrrs.hide);
  }


  const element = document.createElement(tagNode.name, renderedAtrrs.rests || {}, []);

  // "each" attributes
  forEachOrOnce(renderedAtrrs.each, data, (childData) => {
    const children = map(tagNode.children, x => expand(document, x, childData, onMeetCustomTag));
    element.children.push(...children);
  });
  if (isNestedCustom) {
    const nestedTag = new NestedTagInstance(
      tagNode.name,
      data,
      renderedAtrrs.rests,
      {},
      element,
    );
    onMeetCustomTag(nestedTag);
  }
  return element;
}

class NestedTagInstance<TOpts, UOpts> implements TagInstance<TOpts> {
  constructor(
    public readonly name: string,
    public readonly parent: TagInstance<UOpts> | null = null,
    public opts?: { [name: string]: any },
    public tags: {
      [name: string]: TagInstance<any> | ReadonlyArray<TagInstance<any>>,
    } = {},
    public root: VirtualElement | undefined = undefined,
  ) {
  }
  isMounted: boolean = true;
  // tslint:disable-next-line:no-empty
  mount(): void {}
  // tslint:disable-next-line:no-empty
  unmount(): void {}
}
