import { mount } from 'riot';
import RendererBase from './RendererBase';

/**
 * A renderer for `riot`
 */
export default class TestRenderer extends RendererBase {
  constructor() {
    super(mount);
  }
}
