import VirtualElement from './VirtualElement';
import escapeHTML from '../utils/escapeHTML';

/** Implementation of {@see VirtualElement}, only for internal use. */
export default class VirtualElementInternal implements VirtualElement {
  private outerHTMLCache: string = '';

  /**
   * Constructor
   *
   * @param name tagName
   * @param attr attrbutes in string
   * @param innerHTML equivalent to innerHTML of HTMLElement
   */
  constructor(
    private name: string,
    private attr: string | undefined,
    public innerHTML: string) {
    if (name !== escapeHTML(name)) throw new Error(`name must exclude HTML special characters.`);

    this.updateCache();
  }

  private updateCache() {
    let tagStart = this.name;
    if (this.attr !== undefined && this.attr.length !== 0) {
      tagStart = this.name + ' ' + escapeHTML(this.attr);
    }

    this.outerHTMLCache = `<${tagStart}>${this.innerHTML}</${this.name}>`;
  }

  get outerHTML() {
    return this.outerHTMLCache;
  }
}
