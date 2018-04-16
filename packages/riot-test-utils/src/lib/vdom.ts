import { TagInstance, TagOpts } from 'riot';
import { ShallowRenderer } from './renderers';

const renderer = new ShallowRenderer();

/** @deprecated */
function loadTags(source: string) {
  return renderer.loadTags(source);
}

/** @deprecated */
function unloadTag(tagName: string) {
  renderer.unloadTag(tagName);
}

/** @deprecated */
function createTag(name: string, opts?: TagOpts): TagInstance {
  return renderer.createInstance(name, opts);
}

export { TagInstance, TagOpts, loadTags, unloadTag, createTag };
