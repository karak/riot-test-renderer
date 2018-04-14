import * as riot from 'riot';
import RiotRenderer, { RiotElement } from './RiotRenderer';
import EvalContext from './EvalContext';

export interface MountFunction {
  (
    this: typeof riot,
    element: Element,
    tagName: string,
    opts: any
  ): riot.TagInstance[];
}

function createElementToMountTo(tagName: string) {
  // TODO: SVG
  // TODO: fallback "data-is"
  return document.createElement(tagName);
}

/**
 * base class of some shallow renderer for `riot`
 */
export default class RiotRendererBase implements RiotRenderer {
  private context = new EvalContext();
  private instance: riot.TagInstance | null;
  private rendered: RiotElement | null;

  constructor(private mount: MountFunction) {
    this.instance = null;
    this.rendered = null;
  }

  loadTags(source: string) {
    const tagjs = riot.compile(source);
    const result = this.context.evalTag(tagjs);
    return result.tagNames;
  }

  unloadTag(tagName: string) {
    riot.unregister(tagName);
  }

  /**
   * Execute mount and rendering
   *
   * @param src multiple tag sources
   * @param name name of the tag to render
   * @param opts tag interface
   * @returns mounted element
   */
  render(src: string, name: string, opts?: riot.TagOpts): RiotElement;
  /**
   * Execute shallow rendering
   *
   * @param src single tag source or tag name preloaded to render
   * @param opts tag interface
   * @returns rendered tree
   */
  render(src: string, opts?: riot.TagOpts): RiotElement;
  render(): RiotElement {
    let src: string;
    let tagName: string | undefined;
    let opts: riot.TagOpts | undefined;
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
      const tagNames = this.loadTags(src);
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
    return (this.rendered = rendered as HTMLElement | SVGElement);
  }

  /**
   * instanciate tag
   *
   * @param name tag name
   * @param opts tag interface
   * @param children children to yield. Ignored currently
   * @returns created instance unmounted
   */
  createInstance(
    name: string,
    opts: riot.TagOpts = {},
    children: ReadonlyArray<RiotElement> = []
  ) {
    const element = createElementToMountTo(name);
    const rendered: riot.TagInstance[] = this.mount.apply(riot, [
      element,
      name,
      opts,
    ]);
    return rendered[0];
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
