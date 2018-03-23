import TagInstance from './TagInstance';

/**
 * Wrapper of tag instance shallow-rendered.
 *
 * @see shallow
 */
export default class ShallowWrapper<TOpts> {
  /**
   * Constructor
   *
   * @param tagInstance - tag instance to wrap
   */
  constructor(private tagInstance: TagInstance<TOpts>) {
    this.tagInstance.mount();
  }

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
    if (!this.tagInstance.root) throw new Error('Call during mount.');

    return this.tagInstance.root.outerHTML;
  }
}
