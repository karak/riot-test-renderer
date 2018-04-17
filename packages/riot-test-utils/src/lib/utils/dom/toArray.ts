export default function toArray<T extends Node>(nodes: NodeListOf<T>) {
  const n = nodes.length;
  const array = new Array<T>(n);
  for (let i = 0; i < n; i += 1) {
    array[i] = nodes.item(i);
  }
  return array;
}
