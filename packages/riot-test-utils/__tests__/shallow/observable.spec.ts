import { shallow, ShallowWrapper } from '../../src';

describe('shallow', () => {
  describe('opts', () => {
    let wrapper: ShallowWrapper;
    const data1 = { order: 1 };
    const data2 = { order: 2 };

    beforeEach(() => {
      wrapper = shallow('<tag></tag>');
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('on and trigger', () => {
      const fn = jest.fn();
      wrapper.on('event', fn);

      wrapper.trigger('event', data1);
      wrapper.trigger('event', data2);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith(data1);
      expect(fn).toHaveBeenCalledWith(data2);
    });

    it('on and trigger after off', () => {
      const fn = jest.fn();
      wrapper.on('event', fn);
      wrapper.off('event', fn);

      wrapper.trigger('event', data1);
      wrapper.trigger('event', data2);
      expect(fn).toHaveBeenCalledTimes(0);
    });

    it('on and trigger after off all', () => {
      const fn = jest.fn();
      wrapper.on('event', fn);
      wrapper.off('event');

      wrapper.trigger('event', data1);
      wrapper.trigger('event', data2);
      expect(fn).toHaveBeenCalledTimes(0);
    });

    it('passed unwrapped this', done => {
      function checkThis() {
        expect(this).not.toBe(wrapper);
        expect(this).toBe(wrapper.instance);
        done();
      }
      wrapper.on('event', checkThis).trigger('event');
    });

    it('one and trigger', () => {
      const fn = jest.fn();
      wrapper.one('event', fn);

      wrapper.trigger('event', data1);
      wrapper.trigger('event', data2);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith(data1);
      expect(fn).not.toHaveBeenCalledWith(data2);
    });
  });
});
