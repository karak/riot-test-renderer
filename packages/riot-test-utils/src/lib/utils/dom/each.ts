export default function each<T extends Node>(
  nodes: NodeListOf<T>,
  fn: (x: T, i: number, nodes: NodeListOf<T>) => boolean | void
) {
  const n = nodes.length;
  for (let i = 0; i < n; i += 1) {
    if (fn(nodes.item(i), i, nodes) === false) {
      return;
    }
  }
}
