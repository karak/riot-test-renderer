import { ReactElement } from 'react';
import { EnzymeElement } from './EnzymeNode';
import map from 'lodash/map';

export default function elementToTree<P extends object>(
  el: ReactElement<P>
): EnzymeElement<P>;
export default function elementToTree(el: string): string;
export default function elementToTree(el: number): number;
export default function elementToTree(el: boolean): boolean;
export default function elementToTree(el: null): null;
export default function elementToTree<P extends object>(
  el: ReactElement<P> | string | number | boolean | null
): EnzymeElement<P> | string | number | boolean | null {
  if (el === null || typeof el !== 'object' || !('type' in el)) {
    return el;
  }

  const type = el.type;
  const props = el.props;
  const { children } = el.props as any;
  const rendered = map(children, x => elementToTree(x));
  return {
    nodeType: 'host',
    type: type,
    props: props,
    key: null,
    instance: null,
    rendered,
  };
}
