import { shallow, RiotWrapper } from '../../src';

describe('shallow', () => {
  describe('opts', () => {
    const opts = { title: 'title', visible: true };
    let wrapper: RiotWrapper<typeof opts>;

    beforeEach(() => {
      wrapper = shallow('<tag></tag>', opts);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('get opts as Object', () => {
      expect(wrapper.opts).toEqual({ ...opts, dataIs: 'tag' });
    });

    it('get each of opts', () => {
      expect(wrapper.opts.title).toBe(opts.title);
      expect(wrapper.opts.visible).toBe(opts.visible);
    });
  });
});
