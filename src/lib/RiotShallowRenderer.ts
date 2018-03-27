import EvalContext from './EvalContext';
import VirtualDocument from './VirtualDocument';
import { VirtualElement } from './VirtualElement';
import { TagElement } from './parseTag';
import TagInstance from './TagInstance';
import CustomTagInstance from './CustomTagInstance';
import RiotRenderer from './RiotRenderer';
import createRenderingMethods from './createRenderingMethods';
import expand from './expand';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';

/**
 * A shallow renderer for `riot`
 */
export default class RiotShallowRenderer implements RiotRenderer{
  private readonly document: VirtualDocument;
  private instance: TagInstance<any> | null;
  private rendered: VirtualElement | null;

  constructor(document?: VirtualDocument) {
    if (document !== undefined) {
      this.document = document;
    } else {
      const context = new EvalContext();
      this.document = new VirtualDocument(context);
    }
    this.instance = null;
    this.rendered = null;
  }

  loadTags(source: string): void {
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
   * @param src single tag source or tag name preloaded to render
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

    if (/^\s*</m.test(src)) {
      // Case: src is tag source
      const tagNames = this.document.loadTags(src);
      // Select tagName when single tag use.
      if (tagName === undefined) {
        if (tagNames.length !== 1) throw new Error('Tag source must be single');

        tagName = tagNames[0] as string;
      }
    } else {
      // Case: src is tag name
      tagName = src;
    }

    const tagInstance = this.createInstance(tagName, opts);

    tagInstance.mount();
    const rendered = tagInstance.root!;

    this.instance = tagInstance;
    return this.rendered = rendered;
  }

  createInstance<TOpts>(name: string, opts: TOpts) {
    // create tag element, equivalent to React.ReactElement
    const { type, fn } = this.document.createTagElement(name, opts!);

    const shallowRender = createShallowRender(this.document, type);
    const shallowRenderingMethods = createRenderingMethods(shallowRender);
    const tagInstance = new CustomTagInstance(shallowRenderingMethods, null, opts, fn);

    return tagInstance;
  }

  /** Get created instance of `render` */
  getMountedInstance() {
    if (this.instance === null) throw new Error('Call after render');

    return this.instance!;
  }

  /** Get latest result of `render` */
  getRenderedOutput() { // TODO: rename to getRenderOutput
    if (this.rendered === null) throw new Error('Call after render');

    return this.rendered!;
  }

  unmount() {
    if (this.instance !== null) {
      this.instance.unmount();
    }
    this.rendered = null;
    this.instance = null;
  }
}

function createShallowRender(document: VirtualDocument, rootTagNode: TagElement) {
  return function render<TOpts>(this: TagInstance) {
    return expand(document, rootTagNode, this, (name, nestedTag) => {
      // TODO: this.opts rather than embedding into rootTagNode
      if (!(name in this.tags)) {
        // 1st path
        this.tags[name] = nestedTag;
      } else {
        if (!isArray(this.tags[name])) {
          // 2nd path
          (this.tags[name] as any) = [this.tags[name], nestedTag];
        } else {
          // 3rd or greater path
          (this.tags[name] as any).push(nestedTag);
        }
      }
    });
  };
}
