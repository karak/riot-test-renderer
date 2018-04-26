import { TagOpts, TagRefs, NestedTags } from 'riot';
import { RiotWrapper } from './index';
import RiotWrapperImpl from './RiotWrapper';
import { MountOptions, TestRenderer } from '../renderers';

/**
 * Mount a tag with full rendering for testing.
 *
 * @param src - source string to define tag(s).
 * @param name - tagName. You can skip this if src contains a single tag.
 * @param opts - opts to create tag with
 * @param options - options to mount
 * @template TOpts type of opts
 * @template TRefs type of refs property
 * @returns wrapper of the mounted instance
 */
function mount<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
>(
  src: string,
  name: string,
  opts?: TOpts,
  options?: MountOptions
): RiotWrapper<TOpts, TRefs, TTags>;
function mount<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
>(
  src: string,
  opts?: TOpts,
  options?: MountOptions
): RiotWrapper<TOpts, TRefs, TTags>;
function mount<
  TOpts extends TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
>(): RiotWrapper<TOpts, TRefs, TTags> {
  const renderer = new TestRenderer();
  renderer.render.apply(renderer, arguments);
  const tag = renderer.getMountedInstance();
  return new RiotWrapperImpl<TOpts, TRefs, TTags>(tag!);
}

export default mount;
