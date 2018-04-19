import WrapperExtensions from './WrapperExtensions';
import toArray from '../utils/dom/toArray';
import each from '../utils/dom/each';
import lazy from '../utils/misc/lazy';
import Simulate, { FireEvent } from '../Simulate';
import findList from '../utils/dom/findList';
import { toHTML, toJSON } from '../transform';
import map from '../utils/dom/map';

export default class WeakWrapper implements WrapperExtensions {
  private readonly elements = lazy(() => toArray(this.nodeList));

  constructor(private nodeList: NodeListOf<Element>) {}

  get instance(): null {
    return null;
  }

  get root() {
    return this.assertSingle();
  }

  /**
   * Simulate firing an event on all of the elements
   *
   * @param type event type
   * @param options options to override event object
   */
  simulate<T extends {}>(type: string, options?: T) {
    const fire = (Simulate as any)[type] as FireEvent | undefined;
    each(this.nodeList, node => fire!(node, options));
  }

  get(index: number): Element;
  get(): ReadonlyArray<Element>;
  get(index?: number): Element | ReadonlyArray<Element> {
    if (index === undefined) {
      // return all the elements
      return this.elements();
    } else {
      // return each element
      if (index < 0) {
        // ...in reversed order
        index = this.nodeList.length + index;
      }
      return this.nodeList.item(index);
    }
  }

  get length() {
    return this.nodeList.length;
  }

  find(selector: string) {
    return new WeakWrapper(findList(selector, this.nodeList));
  }

  /**
   * Get internal text content
   *
   * @throws {Error} unless single
   */
  text() {
    return this.assertSingle().textContent;
  }

  /**
   * Get outer-HTML string
   *
   * @throws {Error} unless single
   */
  html() {
    return toHTML(this.assertSingle());
  }

  /**
   * Convert to JSON form to generate snapshot
   */
  toJSON(): object | object[] {
    if (this.isSingle()) {
      return toJSON(this.assertSingle());
    } else {
      return map(this.nodeList, toJSON);
    }
  }

  private isSingle() {
    return this.nodeList.length === 1;
  }

  private assertSingle() {
    if (!this.isSingle()) {
      throw new Error('Count of nodes must be one!');
    }
    return this.nodeList.item(0);
  }
}
