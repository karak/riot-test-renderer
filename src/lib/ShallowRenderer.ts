import EvalContext from './EvalContext';
import VirtualDocument from './VirtualDocument';
import { VirtualElement } from './VirtualElement';
import TagMap from './TagMap';
import TagInstance from './TagInstance';
import keys from 'lodash/keys';

/**
 * A shallow renderer for `riot`
 */
export default class ShallowRenderer {
  private readonly context: EvalContext;
  private readonly document: VirtualDocument;
  private instance: TagInstance<any> | null;
  private rendered: VirtualElement | null;

  constructor() {
    this.context = new EvalContext();
    this.document = new VirtualDocument(this.context);
    this.instance = null;
    this.rendered = null;
  }

  loadTags(source: string) {
    this.document.loadTags(source);
  }

  /**
   * Execute shallow rendering
   *
   * @param src multiple tag sources
   * @param name name of the tag to render
   * @param opts tag interface
   * @returns rendered tree
   */
  render<TOpts>(src: string, name: string, opts?: TOpts): VirtualElement;
  /**
   * Execute shallow rendering
   *
   * @param src single tag source to render
   * @param opts tag interface
   * @returns rendered tree
   */
  render<TOpts>(src: string, opts?: TOpts): VirtualElement;
  render<TOpts>(): VirtualElement {
    let src: string;
    let tagName: string | undefined;
    let opts: TOpts | undefined;
    // compile
    // tslint:disable-next-line:no-magic-numbers
    if (arguments.length === 3) {
      [src, tagName, opts] = <any>(arguments);
    // tslint:disable-next-line:no-magic-numbers
    } else if (arguments.length === 2) {
      if (typeof (arguments[1]) === 'string') {
        [src, tagName, opts] = <any>(arguments);
      } else {
        [src, opts] = <any>(arguments);
      }
    } else {
      [src] = <any>(arguments);
    }

    this.loadTags(src);

    // Select tagName when single tag use.
    if (tagName === undefined) {
      const tagNames = keys(this.document.tags);
      if (tagNames.length !== 1) throw new Error('Tag source must be single');

      tagName = tagNames[0] as string;
    }

    // create tag instance
    const tagInstance = this.document.createTag(tagName, opts!);
    tagInstance.mount();
    const rendered = tagInstance.root!;

    this.instance = tagInstance;
    return this.rendered = rendered;
  }

  /** Get created instance of `render` */
  getMountedInstance() {
    return this.instance;
  }

  /** Get latest result of `render` */
  getRenderedOutput() {
    return this.rendered;
  }

  unmount() {
    if (this.instance !== null) {
      this.instance.unmount();
    }
    this.rendered = null;
    this.instance = null;
  }
}
