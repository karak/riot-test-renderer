import TagInstance from './TagInstance';
import RiotShallowRenderer from './RiotShallowRenderer';

const renderer = new RiotShallowRenderer();

/** @deprecated */
function loadTags(source: string) {
  return renderer.loadTags(source);
}

/** @deprecated */
function createTag<TOpts>(name: string, opts?: TOpts): TagInstance<TOpts> {
  return renderer.createInstance(name, opts);
}

export { TagInstance, loadTags, createTag };
