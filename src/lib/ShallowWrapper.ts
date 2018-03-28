import TagInstance from "./TagInstance";
import toHTML from "./toHTML";
import toJSON from "./toJSON";

/**
 * Wrapper of tag instance shallow-rendered.
 *
 * @see shallow
 */
export default class ShallowWrapper<TOpts> {
  private htmlCache: string | null = null;

  /**
   * Constructor
   *
   * @param tagInstance - tag instance to wrap
   */
  constructor(private tagInstance: TagInstance<TOpts>) {}

  /** Get tag instance */
  instance() {
    return this.tagInstance;
  }

  /** Emulate tounmount tag */
  unmount() {
    this.tagInstance.unmount();
  }

  /** Get outer-HTML string */
  html() {
    if (this.tagInstance.root === undefined) throw Error("Mount first");

    if (this.htmlCache === null) {
      this.htmlCache = toHTML(this.tagInstance.root, false);
    }
    return this.htmlCache;
  }

  toJSON(): object | null {
    const root = this.tagInstance.root;
    return toJSON(root !== undefined ? (root as any) : null);
  }
}
