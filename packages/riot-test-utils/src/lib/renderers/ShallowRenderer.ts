import { mount } from 'riot';
import shallowize from 'riot-shallowize';
import RendererBase from './RendererBase';

// hack to retrieve internal function
const shallow = (function() {
  const namespace = shallowize({} as any); // stub
  return namespace.shallow as typeof mount;
})();

/**
 * A shallow renderer for `riot`
 */
export default class ShallowRenderer extends RendererBase {
  constructor() {
    super(shallow);
  }
}
