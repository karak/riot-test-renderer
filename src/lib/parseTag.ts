import { Parser } from 'htmlparser2';
import VirtualElement from './VirtualElement';
import escapeHTML from '../utils/escapeHTML';

export type TagElement = {
  type: 'element',
  name: string;
  attributes: { [name: string]: string }
  children: TagNode[];
  parent: TagElement | null;
};

export type TagTextNode = {
  type: 'text';
  text: string;
  parent: TagElement | null;
};

export type TagNode = TagElement | TagTextNode;

export default function parseTag(name: string, attributes: string | undefined, template: string) {
  const rootNode = parseXml(`<${name} ${attributes}>${template}</${name}>`);
  if (rootNode === null) throw new Error('rootNode is null');
  if (rootNode.type === 'text') throw new Error('rootNode is text');

  return rootNode;
}

function parseXml(rootXml: string): TagNode | null {
  let root: TagNode | null = null;
  let parent: TagElement | null = null;

  const parser = new Parser({
    onopentag: (name, attributes) => {
      const node: TagElement = {
        type: 'element',
        name,
        attributes,
        children: [],
        parent,
      };
      if (parent === null) {
        root = node;
      } else {
        parent.children.push(node);
      }
      parent = node;
    },
    ontext: (text) => {
      const node: TagTextNode = {
        type: 'text',
        text,
        parent,
      };
      if (parent === null) {
        root = node;
      } else {
        parent.children.push(node);
      }
    },
    onclosetag: () => {
      if (parent !== null) {
        parent = parent.parent;
      }
    },
  });

  parser.write(rootXml);
  parser.end();

  return root;
}
