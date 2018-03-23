import {
  observable,
  ObservableCallback,
} from 'riot';
import TagArgs from './TagArgs';
import VirtualDocument from './VirtualDocument';
import VirtualElement from './VirtualElement';
import VirtualElementInternal from './VirtualElementInternal';
import renderTemplate from './renderTemplate';

/**
 * Tag instance of `riot`
 *
 * Representation of instanciated in one element of DOM.
 *
 * @see VirtualElement
 */
export default class TagInstance<TOpts> {
  public isMounted = false;
  public root?: VirtualElement;
  public readonly opts: TOpts | undefined;
  private readonly createElement: (opts?: TOpts) => VirtualElement;

  /** Nested tags. Always empty. This is only for compatibility of real instance */
  public tags: ReadonlyArray<TagInstance<{}>> = [];

  constructor(document: VirtualDocument, args: TagArgs, opts?: TOpts) {
    this.opts = opts;

    // mixin riot.Observable
    observable(this);

    // tslint:disable-next-line:no-magic-numbers
    const name = args[0];
    // tslint:disable-next-line:no-magic-numbers
    const template = args[1];
    // tslint:disable-next-line:no-magic-numbers
    const attributes = args[3];
    // tslint:disable-next-line:no-magic-numbers
    const fn = args[4];

    this.createElement = () => document.createElement(
      name,
      renderTemplate(attributes, this),
      renderTemplate(template, this),
    );

    // execute the script section.
    fn.apply(this);
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

    this.root = this.createElement();
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
