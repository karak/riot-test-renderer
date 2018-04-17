export default class WeakWrapper {
  constructor(private nodeList: NodeListOf<Element>) {}

  get instance() {
    return null;
  }

  get root() {
    return this.assertSingle();
  }

  private assertSingle() {
    if (this.nodeList.length !== 1) {
      throw new Error('Count of nodes must be one!');
    }
    return this.nodeList.item(0);
  }
}
