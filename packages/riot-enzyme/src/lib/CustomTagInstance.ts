import { observable, ObservableCallback } from 'riot-observable';
import TagInstance from './TagInstance';
import { VirtualElement } from './VirtualElement';
import assign from 'lodash/assign';

export interface RenderingMethods<TOpts> {
  mount(this: TagInstance<TOpts>): void;
  update(this: TagInstance<TOpts>): void;
  unmount(this: TagInstance<TOpts>): void;
}

/**
 * Tag instance of `riot`
 *
 * Representation of instanciated in one element of DOM.
 *
 * @see VirtualElement
 */
export default class CustomTagInstance<TOpts = {}, UOpts = {}>
  implements TagInstance<TOpts> {
  public isMounted = false;
  public root?: VirtualElement;

  public tags: {
    [name: string]: TagInstance<any> | Array<TagInstance<any>>;
  } = {};

  constructor(
    methods: RenderingMethods<TOpts>,
    public readonly parent: CustomTagInstance<UOpts> | null,
    public readonly opts: TOpts | undefined,
    scriptFn: () => void
  ) {
    // delegate to mount, update, unmount
    assign(this, methods);

    // mixin riot.Observable
    observable(this);

    // execute the script section.
    scriptFn.apply(this);
  }

  /** Dummy functions for type definitions, which is realized by `riot.observable()` */
  /** @inheritDoc */
  on(event: string, callback: ObservableCallback): this {
    return this;
  }
  /** @inheritDoc */
  one(event: string, callback: ObservableCallback): this {
    return this;
  }
  /** @inheritDoc */
  off(event: string, callback?: ObservableCallback): this {
    return this;
  }
  /** @inheritDoc */
  trigger(event: string, ...args: any[]): this {
    return this;
  }

  /** Dummy functions for typedefinitions, which is delegated to methods parameter */
  // tslint:disable-next-line:no-empty
  mount(): void {}
  // tslint:disable-next-line:no-empty
  update(): void {}
  // tslint:disable-next-line:no-empty
  unmount(): void {}
}
