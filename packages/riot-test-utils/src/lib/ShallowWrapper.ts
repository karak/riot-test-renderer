import { TagInstance, TagOpts, TagRefs } from 'riot';
import toHTML from './toHTML';
import toJSON from './toJSON';

/**
 * Wrapper of tag instance shallow-rendered.
 *
 * @see shallow
 */
export default class ShallowWrapper<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs
> {
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

  /** Get the root element */
  root() {
    return this.tagInstance.root;
  }

  /** Get refs of the instance */
  refs(): TRefs {
    return this.tagInstance.refs as TRefs;
  }

  /** Unmount tag */
  unmount() {
    this.tagInstance.unmount(); // keepTheParent is always false
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
