import { shallow, ShallowWrapper } from '../../src';
import { staticTag } from 'riot-test-renderer-shared/tags/singleTags';

describe('shallow', () => {
  describe('unmount', () => {
    let wrapper: ShallowWrapper<{}>;
    beforeEach(() => {
      wrapper = shallow(staticTag);
    });

    it('flips isMounted flag', () => {
      expect(wrapper.instance().isMounted).toBeTruthy();
      wrapper.unmount();
      expect(wrapper.instance().isMounted).toBeFalsy();
    });

    it('still catches root', () => {
      expect(wrapper.root()).not.toBe(null);
      wrapper.unmount();
      expect(wrapper.root()).not.toBe(null);
    });
  });
});
