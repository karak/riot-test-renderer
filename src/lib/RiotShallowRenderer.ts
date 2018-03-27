import RiotRendererBase from './RiotRendererBase';
import VirtualDocument from './VirtualDocument';
import expand from './expand';

/**
 * A shallow renderer for `riot`
 */
export default class RiotShallowRenderer extends RiotRendererBase {
  constructor(document?: VirtualDocument) {
    super(expand, document);
  }
}
