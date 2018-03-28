import ShallowWrapper from './ShallowWrapper';
import RiotShallowRenderer from './RiotShallowRenderer';

/**
 * A shallow renderer for `riot` compatible to `enzyme`
 *
 * @param src - source string to define tag(s).
 * @param name - tagName. You can skip this if src contains a single tag.
 * @param opts - opts to create tag with
 */
function shallow<TOpts>(
  src: string,
  name: string,
  opts?: TOpts
): ShallowWrapper<TOpts>;
function shallow<TOpts>(src: string, opts?: TOpts): ShallowWrapper<TOpts>;
function shallow<TOpts>(): ShallowWrapper<TOpts> {
  const renderer = new RiotShallowRenderer();
  renderer.render.apply(renderer, arguments);
  const tag = renderer.getMountedInstance();
  return new ShallowWrapper(tag!);
}

export default shallow;
