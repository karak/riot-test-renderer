import * as snapshot from '@wildpeaks/snapshot-dom';

export default function toJSON(element: Element) {
  return snapshot.toJSON(element);
}
