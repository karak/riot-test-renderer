import RiotRendererBase from './RiotRendererBase';
import VirtualDocument from './VirtualDocument';
import createExpand from './createExpand';
import CustomTagInstance from './CustomTagInstance';

/**
 * A string renderer for `riot`
 */
export default class RiotStaticRenderer extends RiotRendererBase {
  constructor(document?: VirtualDocument) {
    const expandStatic = createExpand((_, element) =>
      this.createInstance(element.name, element.attributes, element.children));
    super(expandStatic, document);
  }
}

