import {
  observable,
  ObservableCallback,
} from 'riot';
import TagInstance from './TagInstance';
import { TagNode, TagTextNode, TagElement } from './parseTag';
import VirtualDocument from './VirtualDocument';
import { VirtualElement, VirtualChild } from './VirtualElement';
import expand from './expand';
import isArray from 'lodash/isArray';

/**
 * Tag instance of `riot`
 *
 * Representation of instanciated in one element of DOM.
 *
 * @see VirtualElement
 */
export default class CustomTagInstance<TOpts = {}, UOpts = {}> implements TagInstance<UOpts> {
  public readonly name: string;
  public isMounted = false;
  public root?: VirtualElement;
  private render: () => VirtualElement; // shallow render

  public tags: {
    [name: string]: TagInstance<any> | Array<TagInstance<any>>,
  };

  constructor(
    document: VirtualDocument,
    public readonly parent: CustomTagInstance<UOpts> | null,
    rootTagNode: TagElement,
    public readonly opts: TOpts | undefined,
    scriptFn: () => void,
  ) {
    // mixin riot.Observable
    observable(this);

    this.name = rootTagNode.name;
    this.tags = {};

    // execute the script section.
    scriptFn.apply(this);

    this.render = () => expand(document, rootTagNode, this, (nestedTag) => {
      const name = nestedTag.name;
      if (!(name in this.tags)) {
        // 1st path
        this.tags[name] = nestedTag;
      } else {
        if (!isArray(this.tags[name])) {
          // 2nd path
          (this.tags[name] as any) = [this.tags[name], nestedTag];
        } else {
          // 3rd or greater path
          (this.tags[name] as any).push(nestedTag);
        }
      }
    });
  }

  /** Dummy functions for type definitions, which is realized by `riot.observable()` */
  /** @inheritDoc */
  on(event: string, callback: ObservableCallback): this { return this; }
  /** @inheritDoc */
  one(event: string, callback: ObservableCallback): this { return this; }
  /** @inheritDoc */
  off(event: string, callback?: ObservableCallback): this { return this; }
  /** @inheritDoc */
  trigger(event: string, ...args: any[]): this { return this; }

  mount() {
    if (this.isMounted) return;

    this.root = this.render();

    this.isMounted = true;
    // TODO: this.trigger('mount');
    // TODO: Call this.update() after mount
  }

  // TODO: update()
  update() {
    throw new Error('Not implemented');
  }

  unmount() {
    if (!this.isMounted) return;

    try {
      // TODO: this.trigger('before-unmount');
    } finally {
      delete this.root;
      this.isMounted = false;
    }
    // TODO: this.trigger('unmounted');
    // TODO: and this.off('*');
  }
}
