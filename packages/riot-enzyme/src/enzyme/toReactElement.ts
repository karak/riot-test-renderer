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

function isElement(node: Node): node is HTMLElement | SVGElement {
  return node.nodeType === node.ELEMENT_NODE;
}

function isText(node: Node): node is Text {
  return node.nodeType === node.TEXT_NODE;
}

function domToReactElement(
  el: Node & ChildNode
):
  | ReactElement<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>
  | string {
  if (el instanceof Node) {
    if (isElement(el)) {
      const type = el.tagName ? el.tagName.toLowerCase() : el.nodeName;
      const props = assign(domToProps(el.attributes));
      const children = domToReactChildren(el.childNodes);
      assign(props, { children });
      return {
        type,
        props,
        key: null,
      };
      // TODO: tag
      // TODO: SVGElement
    }
    if (isText(el)) {
      return el.nodeValue as string;
    }
  }
  throw new Error(`Unknown node: ${el}`);
}

function mapNode<T extends Node, U>(xs: NodeListOf<T>, fn: (node: T) => U) {
  const ys: U[] = new Array<U>(xs.length);
  for (let i = 0; i < xs.length; i += 1) {
    ys[i] = fn(xs.item(i));
  }
  return ys;
}

function domToReactChildren(
  childNodes: NodeListOf<Node & ChildNode>
): ReactChild[] {
  return mapNode(childNodes, domToReactElement);
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
  const children = domToReactChildren(tag.root.childNodes);
  const props = assign({}, tag.opts, { children });
  return {
    type,
    props,
    key: null, // @TODO: key
  };
}
