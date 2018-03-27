import TagInstance from './TagInstance';
import VirtualDocument from './VirtualDocument';
import { VirtualElement, VirtualChild } from './VirtualElement';
import { TagNode, TagTextNode, TagElement } from './parseTag';
import renderTemplate from './renderTemplate';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import mapObject from '../utils/mapObject';

export type MeetCustomTagCallback = (name: string, tag: TagInstance<any>) => void;

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

/**
 * Controll rendering on "if", "each", "show" and "hide" attributes
 *
 * @param renderCurrent render body, called if needed.
 * @param renderChildren render all the children, called once or any times with "each".
 */
function expandControllAttributes<TOpts>(
  attributes: { [name: string]: string },
  data: TagInstance<TOpts>,
  onStartTag: (attributes: { [name: string]: any }) => void,
  onContent: (childData: TagInstance<any>) => void,
  onCloseTag: () => VirtualElement,
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

  // render <foo...>
  onStartTag(renderedAtrrs.rests);

  // render <foo>... on "each" attributes
  forEachOrOnce(renderedAtrrs.each, data, onContent);

  // render <foo>Hello</foo>...
  const element = onCloseTag();

  return element;
}

function expandElement<TOpts>(
  document: VirtualDocument,
  tagNode: TagElement,
  data: TagInstance<TOpts>,
  onMeetCustomTag: MeetCustomTagCallback,
): VirtualElement | '' {

  let element: VirtualElement | null = null;

  return expandControllAttributes(
    tagNode.attributes,
    data,
    (attributes) => {
      element = document.createElement(tagNode.name, attributes || {}, []);
    },
    (childData) => {
      const children = map(tagNode.children, x => expand(document, x, childData, onMeetCustomTag));
      element!.children.push(...children);
    },
    () => {
      const isRoot = tagNode.parent === null;
      const isNestedCustom = !isRoot && document.getTagKind(tagNode.name).custom;

      if (isNestedCustom) {
        const nestedTag = new NestedTagInstance(element!);
        nestedTag.mount();
        onMeetCustomTag(tagNode.name, nestedTag);
        return nestedTag.root!;
      }
      return element!;
    },
  );
}

class NestedTagInstance<TOpts, UOpts> implements TagInstance<TOpts> {
  public readonly name: string; // TODO: remove this.
  public readonly parent: TagInstance<UOpts> | null = null;
  public opts?: { [name: string]: any };
  public tags: {
    [name: string]: TagInstance<any> | ReadonlyArray<TagInstance<any>>,
  } = {};

  constructor(public root: VirtualElement) {
    this.name = root.name;
    this.opts = root.attributes;
  }
  isMounted: boolean = true;
  // tslint:disable-next-line:no-empty
  mount(): void {}
  // tslint:disable-next-line:no-empty
  unmount(): void {}
}
