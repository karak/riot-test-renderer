import toHTML from 'riot-test-utils/dist/lib/toHTML';
import RiotRenderer from 'riot-test-utils/dist/lib/RiotRenderer';
import isString from 'lodash/isString';

/**
 * Compatible except first parameter
 *
 * @param el - react element to render
 * @param context - ignored in riot
 *
 * @todo replace by riot/server
 */
export default function renderToStaticMarkup<P>(
  renderer: RiotRenderer,
  el: React.ReactElement<P>,
  context: any
): string {
  if (!isString(el.type)) throw new Error('type must be string');

  const instance = renderer.createInstance(el.type, el.props);
  try {
    const html = toHTML(instance.root!);
    return html;
  } finally {
    instance.unmount();
  }
}
