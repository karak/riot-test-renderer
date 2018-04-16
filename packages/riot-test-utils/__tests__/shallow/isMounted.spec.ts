import { shallow, RiotWrapper } from '../../src';

describe('shallow', () => {
  describe('isMounted', () => {
    let wrapper: RiotWrapper;
    beforeEach(() => {
      wrapper = shallow('<tag></tag>');
    });
    afterEach(() => {
      wrapper.unmount();
    });

    it('is equal to instance.isMounted initially', () => {
      expect(wrapper.isMounted).toBe(wrapper.instance.isMounted);
    });

    it('is equal to instance.isMounted after unmount', () => {
      wrapper.unmount();
      expect(wrapper.isMounted).toBe(wrapper.instance.isMounted);
    });

    it('is equal to instance.isMounted after remount', () => {
      wrapper.unmount();
      wrapper.mount();
      expect(wrapper.isMounted).toBe(wrapper.instance.isMounted);
    });
  });
});
