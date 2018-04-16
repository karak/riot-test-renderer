import { shallow, ShallowWrapper } from '../../src';

describe('shallow', () => {
  describe('parent', () => {
    let wrapper: ShallowWrapper;
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
