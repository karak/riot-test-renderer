import VirtualDocument from './VirtualDocument';
import EvalContext from './EvalContext';
import TagInstance from './TagInstance';

const context = new EvalContext();
const document = new VirtualDocument(context);

export function loadTags(source: string) {
  return document.loadTags(source);
}

export function createTag<TOpts>(name: string, opts?: TOpts) {
  return document.createTag(name, opts);
}
