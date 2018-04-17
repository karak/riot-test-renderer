import toArray from '../utils/dom/toArray';
import each from '../utils/dom/each';
import lazy from '../utils/misc/lazy';
import Simulate, { FireEvent } from '../Simulate';
import findList from '../utils/dom/findList';

export default class WeakWrapper {
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

  private assertSingle() {
    if (this.nodeList.length !== 1) {
      throw new Error('Count of nodes must be one!');
    }
    return this.nodeList.item(0);
  }
}
