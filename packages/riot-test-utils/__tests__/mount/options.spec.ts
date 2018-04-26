import { mount, MountOptions, RiotWrapper, WeakWrapper } from '../../src';

/** source string for multiple tags */
const MULTIPLE_TAGS = '<outer />\n<inner/>';

/** source string for single tag */
const SINGLE_TAG = '<outer />';

/** tag name to specify from multiple tags */
const TAG_NAME = 'outer';

/** create mount options */
function createOptions(): MountOptions {
  const parent = document.createElement('span');
  return { attachTo: parent };
}

function expectToMountOnCreatedElement(wrapper: RiotWrapper | WeakWrapper) {
  const root = wrapper.root;
  expect(root).toBeInstanceOf(HTMLUnknownElement);
  expect(root.tagName.toLowerCase()).toBe(TAG_NAME);
}

describe('mount', () => {
  describe('options', () => {
    describe('overload with "name" parameter', () => {
      it('options with attachedTo specifies an element to mount on', () => {
        const options = createOptions();
        const wrapper = mount(MULTIPLE_TAGS, TAG_NAME, {}, options);
        expect(wrapper.root).toBe(options.attachTo);
      });

      it('empty options specifies nothing', () => {
        const wrapper = mount(MULTIPLE_TAGS, TAG_NAME, {}, {});
        expect(wrapper.root.tagName.toLowerCase()).toBe(TAG_NAME);
      });

      it('undefined options specifies nothing', () => {
        const wrapper = mount(MULTIPLE_TAGS, TAG_NAME, {});
        expect(wrapper.root.tagName.toLowerCase()).toBe(TAG_NAME);
      });
    });

    describe('overload without "name" parameter', () => {
      it('options with attachedTo specifies an element to mount on', () => {
        const options = createOptions();
        const wrapper = mount('<outer />', {}, options);
        expect(wrapper.root).toBe(options.attachTo);
      });

      it('empty options specifies nothing', () => {
        const wrapper = mount(SINGLE_TAG, {}, {});
        expect(wrapper.root.tagName.toLowerCase()).toBe(TAG_NAME);
      });

      it('undefined options specifies nothing', () => {
        const wrapper = mount(SINGLE_TAG, {});
        expect(wrapper.root.tagName.toLowerCase()).toBe(TAG_NAME);
      });
    });
  });
});
