import { VirtualElement, VirtualChild } from './VirtualElement';
import map from 'lodash/map';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';

export interface JSONElement {
  name: string;
  opts: { [name: string]: boolean | string | number | null | object };
  children: ReadonlyArray<JSONChild>;
}

export type JSONChild = JSONElement | string | number | boolean | null;

export default function toJSON(element: VirtualElement): JSONElement;
export default function toJSON(element: string): string;
export default function toJSON(element: null): null;
export default function toJSON(element: number): number;
export default function toJSON(element: boolean): boolean;
export default function toJSON(element: VirtualChild | null | number | boolean): JSONChild {
  if (element === null || typeof element !== 'object') return element;

  return {
    name: element.name,
    opts: element.attributes,
    children: map(element.children, x => toJSON(x)),
  };
}
