/**
 * Create HTML string
 *
 * @todo Use simple dom serializer as well as `riot`
 */
export default function toHTML(element: Element): string {
  if (element instanceof HTMLElement || element instanceof SVGElement) {
    return element.outerHTML;
  }
  return '<unknown></unknown>';
}
