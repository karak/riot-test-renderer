import RiotRenderer from '../lib/RiotRenderer';
import toHTML from '../lib/toHTML';

/**
 * Compatible except first parameter
 *
 * @param vdom - virtual document to host
 * @param el - react element to render
 * @param context - ignored in riot
 */
export default function renderToStaticMarkup<P>(
  renderer: RiotRenderer,
  el: React.ReactElement<P>,
  context: any
): string {
  const tagInstance = renderer.createInstance(el.type as string, el.props);
  tagInstance.mount();
  const html = toHTML(tagInstance.root!, false);
  tagInstance.unmount();
  return html;
}
