import EvalContext from './EvalContext';
import VirtualDocument from './VirtualDocument';
import { VirtualElement, VirtualChild } from './VirtualElement';
import { TagElement } from './parseTag';
import TagInstance from './TagInstance';
import CustomTagInstance from './CustomTagInstance';
import RiotRenderer from './RiotRenderer';
import createRenderingMethods from './createRenderingMethods';

export interface ExpandElement {
  <TOpts>(
    document: VirtualDocument,
    tagNode: TagElement,
    data: TagInstance<TOpts>
  ): VirtualElement;
}

/**
 * base class of some shallow renderer for `riot`
 */
export default class RiotRendererBase implements RiotRenderer {
  protected readonly document: VirtualDocument;
  private instance: TagInstance<any> | null;
  private rendered: VirtualElement | null;

  constructor(private expand: ExpandElement, document?: VirtualDocument) {
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
      [src, tagName, opts] = <any>arguments;
      // tslint:disable-next-line:no-magic-numbers
    } else if (arguments.length === 2) {
      if (typeof arguments[1] === 'string') {
        [src, tagName, opts] = <any>arguments;
      } else {
        [src, opts] = <any>arguments;
      }
    } else {
      [src] = <any>arguments;
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
    return (this.rendered = rendered);
  }

  /**
   * instanciate tag
   *
   * @param name tag name
   * @param opts tag interface
   * @param children children to yield. Ignored currently
   * @returns created instance unmounted
   */
  createInstance<TOpts>(
    name: string,
    opts: TOpts,
    children: ReadonlyArray<VirtualChild> = []
  ) {
    if (children.length > 0) {
      console.warn('Tag with children(<yield />) is not supported.', children);
    }
    // create tag element, equivalent to React.ReactElement
    const { type, fn } = this.document.createTagElement(name);

    const shallowRender = createRender(this.document, this.expand, type);
    const shallowRenderingMethods = createRenderingMethods(shallowRender);
    const tagInstance = new CustomTagInstance<TOpts>(
      shallowRenderingMethods,
      null,
      opts,
      fn
    );

    return tagInstance;
  }

  /** Get created instance of `render` */
  getMountedInstance() {
    if (this.instance === null) throw new Error('Call after render');

    return this.instance!;
  }

  /** Get latest result of `render` */
  getRenderedOutput() {
    // TODO: rename to getRenderOutput
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

function createRender(
  document: VirtualDocument,
  expand: ExpandElement,
  rootTagNode: TagElement
) {
  return function render(this: TagInstance) {
    return expand(document, rootTagNode, this);
  };
}
