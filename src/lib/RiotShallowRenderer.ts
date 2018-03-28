import RiotRendererBase from './RiotRendererBase';
import VirtualDocument from './VirtualDocument';
import { VirtualElement } from './VirtualElement';
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
    rootToMount: VirtualElement,
  ) {
    this.opts = rootToMount.attributes as any;
    this.rootToMount = rootToMount;
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

/**
 * A shallow renderer for `riot`
 */
export default class RiotShallowRenderer extends RiotRendererBase {
  constructor(document?: VirtualDocument) {
    const expandShallow = createExpand(
      (name, opts, children) => {
        const rootToMount = this.document.createElement(name, opts, children);
        return new ShallowTagInstance(rootToMount)
      }
    );

    super(expandShallow, document);
  }
}
