import { TagInstance, TagOpts } from 'riot';
import toHTML from './toHTML';
import toJSON from './toJSON';

/**
 * Wrapper of tag instance shallow-rendered.
 *
 * @see shallow
 */
export default class ShallowWrapper<TOpts extends TagOpts> {
  /**
   * Constructor
   *
   * @param tagInstance - tag instance to wrap
   */
  constructor(private tagInstance: TagInstance) {}

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
    const root = this.tagInstance.root;
    return root !== undefined ? toHTML(root) : '';
  }

  toJSON(): object | null {
    const root = this.tagInstance.root;
    return toJSON(root !== undefined ? (root as any) : null);
  }
}
