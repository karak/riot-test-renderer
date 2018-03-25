import toHTML from '../lib/toHTML';
import VirtualDocument from '../lib/VirtualDocument';

/**
 * Compatible except first parameter
 *
 * @param vdom - virtual document to host
 * @param el - react element to render
 * @param context - ignored in riot
 */
export default function renderToStaticMarkup<P>(
  vdom: VirtualDocument,
  el: React.ReactElement<P>,
  context: any,
): string {
  const tagInstance = vdom.createTag(el.type as string, el.props);
  tagInstance.mount();
  return toHTML(tagInstance.root!, false);
}
