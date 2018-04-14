import { mount } from 'riot';
import RiotRendererBase from './RiotRendererBase';

/**
 * A renderer for `riot`
 */
export default class RiotStaticRenderer extends RiotRendererBase {
  constructor() {
    super(mount);
  }
}
