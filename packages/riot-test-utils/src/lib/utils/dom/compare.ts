/** compare two nodes in the appearance to sort */
export default function compare(lhs: Node, rhs: Node) {
  return lhs.compareDocumentPosition(rhs) <= 0;
  // <= inclusive is required for unique
}
