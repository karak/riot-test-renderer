import RiotRendererBase from './RiotRendererBase';
import VirtualDocument from './VirtualDocument';
import { VirtualElement } from './VirtualElement';
import { TagElement } from './parseTag';
import TagInstance from './TagInstance';

import createExpand from './createExpand';

/** Psuedo tag instance of `shallow()` */
class ShallowTagInstance<TOpts, UOpts> implements TagInstance<TOpts> {
  public readonly name: string; // TODO: remove this.
  public readonly parent: TagInstance<UOpts> | null = null;
  public opts?: { [name: string]: any };
  public tags: {
    [name: string]: TagInstance<any> | ReadonlyArray<TagInstance<any>>,
  } = {};

  constructor(public root: VirtualElement) {
    this.name = root.name;
    this.opts = root.attributes;
  }
  isMounted: boolean = true;
  // tslint:disable-next-line:no-empty
  mount(): void {}
  // tslint:disable-next-line:no-empty
  unmount(): void {}
}

const expandShallow = createExpand((_, element) => new ShallowTagInstance(element!));

/**
 * A shallow renderer for `riot`
 */
export default class RiotShallowRenderer extends RiotRendererBase {
  constructor(document?: VirtualDocument) {
    super(expandShallow, document);
  }
}
