import { VirtualElement } from './VirtualElement';

export default interface TagInstance<TOpts = {}, UOpts = {}> {
  readonly parent: TagInstance<UOpts> | null;
  opts?: TOpts;
  tags: {
    [name: string]: TagInstance<any> | ReadonlyArray<TagInstance<any>>;
  };
  isMounted: boolean;
  root?: VirtualElement;
  mount(): void;
  unmount(): void;
};
