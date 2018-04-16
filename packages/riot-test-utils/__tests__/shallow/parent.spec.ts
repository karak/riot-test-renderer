import { shallow, RiotWrapper } from '../../src';

describe('shallow', () => {
  describe('parent', () => {
    let wrapper: RiotWrapper;
    beforeEach(() => {
      wrapper = shallow('<tag></tag>');
    });
    afterEach(() => {
      wrapper.unmount();
    });

    it('is always null', () => {
      expect(wrapper.parent).toBeNull();
    });

    it('is not defined after unmount', () => {
      wrapper.unmount();
      expect(wrapper.parent).toBeNull();
    });
  });
});
