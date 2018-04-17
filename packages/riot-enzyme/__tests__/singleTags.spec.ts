import { shallow, ShallowWrapper } from '../src';
import {
  staticTag,
  tagWithOpts,
} from 'riot-test-renderer-shared/tags/singleTags';

describe('enzyme-riot-adapter', () => {
  describe('staticTag', () => {
    let wrapper: ShallowWrapper<{}>;

    beforeEach(() => {
      wrapper = shallow(staticTag, 'static');
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('renders html', () => {
      expect(wrapper.html()).toBe(
        '<static data-is="static"><p>Hello, world!</p></static>'
      );
    });

    it('finds by name', () => {
      expect(wrapper.find('p').text()).toBe('Hello, world!');
    });

    it('has empty opts from undefined', () => {
      expect(wrapper.opts()).toEqual({});
    });

    it('should match snapshot', () => {
      expect(wrapper.toJson()).toMatchSnapshot();
    });
  });

  describe('tagWithOpts', () => {
    let wrapper: ShallowWrapper<{}>;

    beforeEach(() => {
      wrapper = shallow(tagWithOpts, 'tag', { data: 'Hello, world!' });
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('shoud have the same opts as passed', () => {
      expect(wrapper.opts()).toEqual({ data: 'Hello, world!' });
    });

    it('should match snapshot', () => {
      expect(wrapper.toJson()).toMatchSnapshot();
    });
  });
});
