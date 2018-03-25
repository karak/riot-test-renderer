import * as React from 'react'; // Only for type definitions.
import VirtualDocument from '../lib/VirtualDocument';
import { VirtualElement, VirtualChild } from '../lib/VirtualElement';
import map from 'lodash/map';
import isString from 'lodash/isString';

export default function elementToTree(el: string): string;
export default function elementToTree(el: VirtualElement): React.ReactElement<{}>;
export default function elementToTree(el: VirtualChild): React.ReactElement<{}> | string | number {
  if (isString(el)) {
    return el;
  }
  return {
    type: el.name,
    props: el.attributes,
    key: null,
    children: map(el.children, x => elementToTree(x)),
  };
}
