export default function map<T extends Node, U>(
  nodes: NodeListOf<T>,
  fn: (x: T, i: number, nodes: NodeListOf<T>) => U
): U[] {
  const n = nodes.length;
  const result = new Array<U>(n);
  for (let i = 0; i < n; i += 1) {
    result[i] = fn(nodes.item(i), i, nodes);
  }
  return result;
}
