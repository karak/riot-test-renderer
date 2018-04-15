import { TagOpts, TagRefs } from 'riot';
import ShallowWrapper from './ShallowWrapper';
import RiotShallowRenderer from './RiotShallowRenderer';

/**
 * A shallow renderer for `riot` compatible to `enzyme`
 *
 * @param src - source string to define tag(s).
 * @param name - tagName. You can skip this if src contains a single tag.
 * @param opts - opts to create tag with
 * @template TOpts type of opts
 * @template TRefs type of refs property
 */
function shallow<TOpts extends TagOpts, TRefs extends TagRefs = TagRefs>(
  src: string,
  name: string,
  opts?: TOpts
): ShallowWrapper<TOpts, TRefs>;
function shallow<TOpts extends TagOpts, TRefs extends TagRefs = TagRefs>(
  src: string,
  opts?: TOpts
): ShallowWrapper<TOpts, TRefs>;
function shallow<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs
>(): ShallowWrapper<TOpts, TRefs> {
  const renderer = new RiotShallowRenderer();
  renderer.render.apply(renderer, arguments);
  const tag = renderer.getMountedInstance();
  return new ShallowWrapper<TOpts, TRefs>(tag!);
}

export default shallow;
