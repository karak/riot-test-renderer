export interface ReactTestElement {
  type: string;
  props: ReactProps;
  children: ReactTestChild[];
  $$typeof?: Symbol;
}

const JSON_TYPE = Symbol && Symbol.for('react.test.json');

export interface ReactProps {
  [name: string]: any;
}

export type ReactTestChild = ReactTestElement | string | number | null;

function getTagName(element: HTMLElement | SVGElement) {
  if ('tagName' in element) {
    return element.tagName.toLowerCase();
  } else {
    return (element as any).nodeName as string;
  }
}

function getAttributes(element: HTMLElement | SVGElement) {
  const attrs: ReactProps = {};

  const xs = element.attributes;
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs.item(i);
    if (x !== null) {
      attrs[x.nodeName] = [x.nodeValue];
    }
  }

  return attrs;
}

function toJSONChild(node: Node): ReactTestChild {
  switch (node.nodeType) {
    case node.ELEMENT_NODE:
      return toJSON(node as Element);
    case node.TEXT_NODE:
      return node.nodeValue;
    default:
      // ignore
      return null;
  }
}

function getChildren(element: HTMLElement | SVGElement) {
  const result = [];
  if (element.hasChildNodes()) {
    const childNodes = element.childNodes;
    for (let i = 0; i < childNodes.length; i += 1) {
      const child = childNodes.item(i);
      const jsonChild = toJSONChild(child);
      if (jsonChild !== null) {
        result.push(jsonChild);
      }
    }
  }
  return result;
}

/**
 * Transform to object-tree for snapshot testing
 * which is compatible to "react.test.json" in Jest.
 */
export default function toJSON(element: Element): ReactTestElement {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    throw new Error('element must be HTMLElement or SVGElement');
  }

  const type = getTagName(element);
  const props = getAttributes(element);
  const children = getChildren(element);

  return {
    type,
    props,
    children,
    $$typeof: JSON_TYPE,
  };
}
