import EvalContext from './EvalContext';
import VirtualDocument from './VirtualDocument';
import TagMap from './TagMap';
import ShallowWrapper from './ShallowWrapper';

/**
 * A shallow renderer for `riot`
 */
export default class ShallowRenderer {
  readonly context: EvalContext;
  readonly document: VirtualDocument;

  constructor() {
    this.context = new EvalContext();
    this.document = new VirtualDocument(this.context);
  }

  loadTags(source: string) {
    this.document.loadTags(source);
  }

  get tags(): TagMap {
    return this.document.tags;
  }

  shallow<TOpts>(name: string, opts?: TOpts) {
    const tag = this.document.createTag(name, opts);
    return new ShallowWrapper<TOpts>(tag);
  }
}
