import TagInstance from './TagInstance';
import CustomTagInstance, { RenderingMethods } from './CustomTagInstance';
import { VirtualElement } from './VirtualElement';
import forEach from 'lodash/forEach';
import forEachRight from 'lodash/forEachRight';
import isArray from 'lodash/isArray';

export default function createRenderingMethods<TOpts>(
  render: (this: TagInstance<TOpts>) => VirtualElement
): RenderingMethods<TOpts> {
  return {
    mount(this: CustomTagInstance<TOpts>) {
      if (this.isMounted) return;

      this.root = render.apply(this);

      this.isMounted = true;
      // TODO: this.trigger('mount');
      // TODO: Call this.update() after mount
    },
    // TODO: update()
    update(this: CustomTagInstance<TOpts>) {
      throw new Error('Not implemented');
    },
    unmount(this: CustomTagInstance<TOpts>) {
      if (!this.isMounted) return;

      try {
        // unmount reverse order against mount
        forEachRight(this.tags, tagOrTags => {
          if (isArray(tagOrTags)) {
            forEachRight(tagOrTags, x => x.unmount());
          } else {
            tagOrTags.unmount();
          }
        });
        forEach(this.tags, (_, key) => {
          delete this.tags[key];
        });
        // TODO: this.trigger('before-unmount');
      } finally {
        delete this.root;
        this.isMounted = false;
      }
      // TODO: this.trigger('unmounted');
      // TODO: and this.off('*');
    },
  };
}
