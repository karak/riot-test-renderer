import { shallow, RiotWrapper } from '../../src';
import { staticTag } from 'riot-test-renderer-shared/tags/singleTags';

describe('shallow', () => {
  describe('is', () => {
    let wrapper: RiotWrapper;

    beforeEach(() => {
      wrapper = shallow(staticTag);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('select by tagname', () => {
      expect(wrapper.is('static')).toBeTruthy();
    });
    it('select by data-is attribute', () => {
      expect(wrapper.is('[data-is="static"]')).toBeTruthy();
    });

    describe('under context', () => {
      it('select by tagname', () => {
        expect(wrapper.find('p').is('p')).toBeTruthy();
      });

      it('child selector', () => {
        expect(wrapper.find('p').is('static p')).toBeTruthy();
        expect(wrapper.find('p').is('static > p')).toBeTruthy();
        expect(wrapper.find('p').is('nowhere p')).toBeFalsy();
        expect(wrapper.find('p').is('nowhere > p')).toBeFalsy();
      });
    });
  });
});
