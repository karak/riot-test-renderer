import { TagOpts, TagRefs, NestedTags } from 'riot';
import RiotWrapper from './RiotWrapper';
import { ShallowRenderer } from '../renderers';

/**
 * A shallow renderer for `riot` compatible to `enzyme`
 *
 * @param src - source string to define tag(s).
 * @param name - tagName. You can skip this if src contains a single tag.
 * @param opts - opts to create tag with
 * @template TOpts type of opts
 * @template TRefs type of refs property
 */
function shallow<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
>(src: string, name: string, opts?: TOpts): RiotWrapper<TOpts, TRefs, TTags>;
function shallow<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
>(src: string, opts?: TOpts): RiotWrapper<TOpts, TRefs, TTags>;
function shallow<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
>(): RiotWrapper<TOpts, TRefs, TTags> {
  const renderer = new ShallowRenderer();
  renderer.render.apply(renderer, arguments);
  const tag = renderer.getMountedInstance();
  return new RiotWrapper<TOpts, TRefs, TTags>(tag!);
}

export default shallow;
