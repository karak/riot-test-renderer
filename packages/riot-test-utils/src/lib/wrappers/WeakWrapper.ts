import toArray from '../utils/dom/toArray';
import lazy from '../utils/misc/lazy';

export default class WeakWrapper {
  readonly elements = lazy(() => toArray(this.nodeList));

  constructor(private nodeList: NodeListOf<Element>) {}

  get instance() {
    return null;
  }

  get root() {
    return this.assertSingle();
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

  private assertSingle() {
    if (this.nodeList.length !== 1) {
      throw new Error('Count of nodes must be one!');
    }
    return this.nodeList.item(0);
  }
}
