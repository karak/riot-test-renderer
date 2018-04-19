import each from 'lodash/each';
import assign from 'lodash/assign';

function empty(ownerDocument: Document) {
  return ownerDocument.createDocumentFragment().childNodes;
}

export default function toNodeList<T extends Node>(
  array: ReadonlyArray<T>
): NodeListOf<T> {
  const properties: any = {};

  each(array, (x, i) => {
    properties[i] = { value: x, enumerable: true };
  });

  const ownerDocument = array.length > 0 ? array[0].ownerDocument : document;

  return Object.create(
    empty(ownerDocument),
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
