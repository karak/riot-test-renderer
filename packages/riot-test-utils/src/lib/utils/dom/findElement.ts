export default function findElement(selector: string, element: Element) {
  return element.querySelectorAll(selector);
}
