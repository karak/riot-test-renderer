import {
  ReactElement,
  ReactChild,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react';
import { TagInstance, TagOpts, util } from 'riot';
import assign from 'lodash/assign';

function domToProps(attributes: NamedNodeMap) {
  const attrs: { [name: string]: any } = {};

  for (let i = 0; i < attributes.length; i += 1) {
    const x = attributes.item(i);
    if (x !== null) {
      attrs[x.nodeName] = [x.nodeValue];
    }
  }

  return attrs;
}

function domToReactElement(
  el: Element
):
  | ReactElement<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>
  | string {
  if (el instanceof HTMLElement || el instanceof SVGElement) {
    // TODO: tag
    switch (el.nodeType) {
      case el.TEXT_NODE:
        return el.nodeValue as string;
      case el.ELEMENT_NODE:
        const type = el.tagName ? el.tagName.toLowerCase() : el.nodeName;
        const props = assign(domToProps(el.attributes));
        const children = domToReactChildren(el.children);
        assign(props, { children });
        return {
          type,
          props,
          key: null,
        };
    }
  }
  // TODO: SVGElement
  throw new Error(`Unknown node: ${el}`);
}

function domToReactChildren(children: HTMLCollection) {
  const result: ReactChild[] = [];
  for (let i = 0; i < children.length; i += 1) {
    const child = children.item(i);
    result.push(domToReactElement(child));
  }
  return result;
}

/** get tagName, considering a "data-is" attribute */
function getTagName(el: Element) {
  return util.tags.getTagName(el, false);
}

/** ReactElement adapter from TagInstance of riot */
export default function toReactElement(tag: TagInstance): ReactElement<TagOpts>;
export default function toReactElement(tag: null): null;
export default function toReactElement(
  tag: TagInstance | null
): ReactElement<TagOpts> | null {
  if (tag === null) return null;

  const type = getTagName(tag.root);
  const children = domToReactChildren(tag.root.children);
  const props = assign({}, tag.opts, children);
  return {
    type,
    props,
    key: null, // @TODO: key
  };
}
