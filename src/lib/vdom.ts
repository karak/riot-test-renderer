import VirtualDocument from './VirtualDocument';
import EvalContext from './EvalContext';
import TagInstance from './TagInstance';
import RiotShallowRenderer from './RiotShallowRenderer';

const renderer = new RiotShallowRenderer();

/** @deprecated */
export function loadTags(source: string) {
  return renderer.loadTags(source);
}

/** @deprecated */
export function createTag<TOpts>(name: string, opts?: TOpts): TagInstance<TOpts> {
  renderer.renderByName(name, opts);

  return renderer.getMountedInstance();
}
