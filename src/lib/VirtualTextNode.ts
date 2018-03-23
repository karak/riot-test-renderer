import VirtualElement from './VirtualElement';
import escapeHTML from '../utils/escapeHTML';
import VirtualDocument from './VirtualDocument';

function makeOuterHTML(name: string, attributes: string | undefined, innerHTML: string) {
  let tagStart = name;
  if (attributes !== undefined && attributes.length !== 0) {
    tagStart = name + ' ' + escapeHTML(attributes);
  }

  return `<${tagStart}>${innerHTML}</${name}>`;
}

/** Implementation of {@see VirtualElement}, only for internal use. */
export default class VirtualTextNode implements VirtualElement {
  /**
   * Constructor
   *
   * @param document virtual document
   * @param name tagName
   * @param attr attrbutes in string
   * @param innerHTML equivalent to innerHTML of HTMLElement
   */
  constructor(
    public readonly document: VirtualDocument,
    public readonly textContent: string,
  ) {}

  get innerHTML() {
    return escapeHTML(this.textContent);
  }

  get outerHTML() {
    return escapeHTML(this.textContent);
  }

  toString() {
    return this.textContent;
  }
}
