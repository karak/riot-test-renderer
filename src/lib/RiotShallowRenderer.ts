import RiotRendererBase from './RiotRendererBase';
import VirtualDocument from './VirtualDocument';
import { VirtualElement, VirtualChild } from './VirtualElement';
import TagInstance from './TagInstance';

import createExpand from './createExpand';

/** Psuedo tag instance of `shallow()` */
class ShallowTagInstance<TOpts, UOpts> implements TagInstance<TOpts> {
  public readonly parent: TagInstance<UOpts> | null = null;
  public opts?: TOpts;
  public tags: {
    [name: string]: TagInstance<any> | ReadonlyArray<TagInstance<any>>;
  } = {};
  public rootToMount: VirtualElement;
  public root?: VirtualElement;
  public isMounted: boolean = false;

  constructor(
    name: string,
    opts: TOpts,
    children: ReadonlyArray<VirtualChild>
  ) {
    this.opts = opts;
    this.rootToMount = {
      name,
      attributes: opts,
      children: children as VirtualChild[],
    };
  }

  // tslint:disable-next-line:no-empty
  mount(): void {
    if (this.isMounted) return;

    this.isMounted = true;
    this.root = this.rootToMount;
  }

  // tslint:disable-next-line:no-empty
  unmount(): void {
    if (!this.isMounted) return;

    delete this.root;
    this.isMounted = false;
  }
}

const expandShallow = createExpand(
  (name, opts, children) => new ShallowTagInstance(name, opts, children)
);

/**
 * A shallow renderer for `riot`
 */
export default class RiotShallowRenderer extends RiotRendererBase {
  constructor(document?: VirtualDocument) {
    super(expandShallow, document);
  }
}
