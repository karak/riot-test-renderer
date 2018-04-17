import each from 'lodash/each';
import assign from 'lodash/assign';
import lazy from '../misc/lazy';

const empty = lazy(() => document.createDocumentFragment().childNodes);

export default function toNodeList<T extends Node>(
  array: ReadonlyArray<T>
): NodeListOf<T> {
  const properties: any = {};

  each(array, (x, i) => {
    properties[i] = { value: x, enumerable: true };
  });

  return Object.create(
    empty(),
    assign(properties, {
      length: { value: array.length },
      item: {
        value: function(this: typeof properties, i: number) {
          return this[i || 0];
        },
        enumerable: true,
      },
    })
  );
}
