import { EnzymeElement } from './EnzymeNode';
import { VirtualElement } from '../lib/VirtualElement';
import map from 'lodash/map';
import isString from 'lodash/isString';

export default function elementToTree(el: VirtualElement): EnzymeElement<any>;
export default function elementToTree(el: string): string;
export default function elementToTree(
  el: VirtualElement | string
): EnzymeElement<any> | string;
export default function elementToTree(
  el: VirtualElement | string
): EnzymeElement<any> | string {
  if (isString(el)) return el;

  return {
    nodeType: 'host',
    type: el.name,
    props: el.attributes,
    key: null,
    instance: null,
    rendered: map(el.children, x => elementToTree(x)),
  };
}
