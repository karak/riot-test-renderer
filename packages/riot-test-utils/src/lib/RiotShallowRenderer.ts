import { mount } from 'riot';
import shallowize from 'riot-shallowize';
import RiotRendererBase from './RiotRendererBase';
import EvalContext from './EvalContext';

// hack to retrieve internal function
const shallow = (function() {
  const namespace = shallowize({});
  return namespace.shallow as typeof mount;
})();

/**
 * A shallow renderer for `riot`
 */
export default class RiotShallowRenderer extends RiotRendererBase {
  constructor(context: EvalContext) {
    super(shallow, context);
  }
}
