import { shallow, ShallowWrapper } from '../../src';

describe('shallow', () => {
  describe('mount', () => {
    let wrapper: ShallowWrapper;
    beforeEach(() => {
      wrapper = shallow('<tag></tag>');
    });
    afterEach(() => {
      wrapper.unmount();
    });

    it('set isMounted initially', () => {
      expect(wrapper.instance.isMounted).toBeTruthy();
    });

    it('can remount after unmount', () => {
      wrapper.unmount();
      expect(wrapper.instance.isMounted).toBeFalsy();
      wrapper.mount();
      expect(wrapper.instance.isMounted).toBeTruthy();
    });
  });
});
