import { mount } from 'riot';
import shallowize from 'riot-shallowize';
import RiotRendererBase from './RiotRendererBase';

// hack to retrieve internal function
const shallow = (function() {
  const namespace = shallowize({} as any); // stub
  return namespace.shallow as typeof mount;
})();

/**
 * A shallow renderer for `riot`
 */
export default class RiotShallowRenderer extends RiotRendererBase {
  constructor() {
    super(shallow);
  }
}
