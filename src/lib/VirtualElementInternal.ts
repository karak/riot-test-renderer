import VirtualElement from './VirtualElement';
import escapeHTML from '../utils/escapeHTML';
import VirtualDocument from './VirtualDocument';
import map from 'lodash/map';

function makeOuterHTML(name: string, attributes: string | undefined, innerHTML: string) {
  let tagStart = name;
  if (attributes !== undefined && attributes.length !== 0) {
    tagStart = name + ' ' + attributes;
  }

  return `<${tagStart}>${innerHTML}</${name}>`;
}

/** Implementation of {@see VirtualElement}, only for internal use. */
export default class VirtualElementInternal implements VirtualElement {
  public readonly document: VirtualDocument;
  public readonly innerHTML: string;
  public readonly outerHTML: string;

  /**
   * Constructor
   *
   * @param document virtual document
   * @param name tagName
   * @param attr attrbutes in string
   * @param children child elements
   */
  constructor(
    document: VirtualDocument,
    name: string,
    attr: string | undefined,
    children: ReadonlyArray<VirtualElement>,
  ) {
    if (name !== escapeHTML(name)) throw new Error(`name must exclude HTML special characters.`);

    this.document = document;
    this.innerHTML = map(children, x => x.outerHTML).join('');
    this.outerHTML = makeOuterHTML(name, attr, this.innerHTML);
  }
}

