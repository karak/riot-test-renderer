import {
  ShallowRenderer,
  TagInstance,
  TagOpts,
} from '../../src';
import each from 'lodash/each';

/** Setup utility to load and mount tags for jasmine */
export default function setupTags<TOpts extends TagOpts>(
  source: string,
  name: string,
  opts: TOpts,
  beforeMount: (tag: TagInstance) => void
): void;
export default function setupTags<TOpts extends TagOpts>(
  source: string,
  name: string,
  beforeMount: (tag: TagInstance) => void
): void;
export default function setupTags<TOpts extends TagOpts>(
  source: string,
  name: string
): void {
  let opts: TOpts | undefined;
  let beforeMount: (tag: TagInstance) => void;

  // tslint:disable-next-line:no-magic-numbers
  if (arguments.length <= 3) {
    opts = undefined;
    // tslint:disable-next-line:no-magic-numbers
    beforeMount = arguments[2];
  } else {
    // tslint:disable-next-line:no-magic-numbers
    opts = arguments[2];
    // tslint:disable-next-line:no-magic-numbers
    beforeMount = arguments[3];
  }

  const renderer = new ShallowRenderer();
  let tag: TagInstance | null = null;
  let tagNames: string[] | null = null;

  beforeAll(() => {
    tagNames = renderer.loadTags(source);
  });

  beforeEach(() => {
    tag = renderer.createInstance(name, opts);
    beforeMount(tag);
    tag.mount();
  });

  afterEach(() => {
    if (tag !== null) {
      tag.unmount();
      tag = null;
    }
  });

  afterAll(() => {
    if (tagNames) {
      each(tagNames, x => renderer.unloadTag(x));
    }
  });
}
