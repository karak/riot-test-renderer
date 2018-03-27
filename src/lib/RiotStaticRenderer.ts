import RiotRendererBase from './RiotRendererBase';
import VirtualDocument from './VirtualDocument';
import createExpand from './createExpand';
import CustomTagInstance from './CustomTagInstance';

/**
 * A string renderer for `riot`
 */
export default class RiotStaticRenderer extends RiotRendererBase {
  constructor(document?: VirtualDocument) {
    const expandStatic = createExpand((name, opts, children) =>
      this.createInstance(name, opts, children)
    );
    super(expandStatic, document);
  }
}
