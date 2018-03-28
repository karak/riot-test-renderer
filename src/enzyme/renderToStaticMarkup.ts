import RiotRenderer from '../lib/RiotRenderer';
import toHTML from '../lib/toHTML';
import { VirtualElement } from '../lib/VirtualElement';

/**
 * Compatible except first parameter
 *
 * @param vdom - virtual document to host
 * @param el - react element to render
 * @param context - ignored in riot
 */
export default function renderToStaticMarkup(
  renderer: RiotRenderer,
  el: VirtualElement,
  context: any
): string {
  switch (el.type) {
    case 'element':
      // TODO: recursive expansion of 'tag' children.
      console.warn('Current riot-enzyme always renders shallow tree');
      return toHTML(el);
    case 'tag':
      const tagInstance = renderer.createInstance(el.name, el.attributes, el.children);
      tagInstance.mount();
      const html = toHTML(tagInstance.root!);
      tagInstance.unmount();
      return html;
    default:
      throw new Error(`Unknown type: ${el.type}`);
  }
}
