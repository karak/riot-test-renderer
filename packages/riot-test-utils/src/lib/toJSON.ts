export interface JSONElement {
  name: string;
  attributes: JSONAttributes;
  children: JSONChild[];
}

export interface JSONAttributes {
  [name: string]: any;
}

export type JSONChild = JSONElement | string | null;

function getTagName(element: HTMLElement | SVGElement) {
  if ('tagName' in element) {
    return element.tagName.toLowerCase();
  } else {
    return (element as any).nodeName as string;
  }
}

function getAttributes(element: HTMLElement | SVGElement) {
  const attrs: JSONAttributes = {};

  const xs = element.attributes;
  for (let i = 0; i < xs.length; i += 1) {
    const x = xs.item(i);
    if (x !== null) {
      attrs[x.nodeName] = [x.nodeValue];
    }
  }

  return attrs;
}

function toJSONChild(node: Node): JSONChild {
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

export default function toJSON(element: Element): JSONElement {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    throw new Error('element must be HTMLElement or SVGElement');
  }

  const name = getTagName(element);
  const attributes = getAttributes(element);
  const children = getChildren(element);

  return {
    name,
    attributes,
    children,
  };
}
