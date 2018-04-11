import { mount } from 'riot';
import RiotRendererBase from './RiotRendererBase';
import EvalContext from './EvalContext';

/**
 * A renderer for `riot`
 */
export default class RiotStaticRenderer extends RiotRendererBase {
  constructor(context: EvalContext) {
    super(mount, context);
  }
}
