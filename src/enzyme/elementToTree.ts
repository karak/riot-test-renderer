import { EnzymeNode } from './EnzymeNode';
import { VirtualElement } from '../lib/VirtualElement';
import map from 'lodash/map';
import isString from 'lodash/isString';

export default function elementToTree(el: VirtualElement): EnzymeNode<any> {
  return {
    nodeType: 'host',
    type: el.name,
    props: el.attributes,
    key: null,
    instance: null,
    rendered: map(el.children, x => {
      if (isString(x)) {
        return x;
      }
      return elementToTree(x);
    }),
  };
}
