import { loadTags, createTag, TagInstance } from '../../src/vdom';

/** Setup utility to load and mount tags for jasmine */
export default function setupTags<TOpts>(
  source: string,
  name: string,
  opts: TOpts,
  beforeMount: (tag: TagInstance<TOpts>) => void
): void;
export default function setupTags<TOpts>(
  source: string,
  name: string,
  beforeMount: (tag: TagInstance<TOpts>) => void
): void;
export default function setupTags<TOpts>(source: string, name: string): void {
  let opts: TOpts | undefined;
  let beforeMount: (tag: TagInstance<TOpts>) => void;

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

  let tag: TagInstance<TOpts> | null = null;

  beforeAll(() => {
    loadTags(source);
  });

  beforeEach(() => {
    tag = createTag(name, opts);
    beforeMount(tag);
    tag.mount();
  });

  afterEach(() => {
    if (tag !== null) {
      tag.unmount();
      tag = null;
    }
  });
}
