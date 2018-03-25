import { shallow, ShallowWrapper } from '../../src/enzyme/index';

import {
  staticTag,
} from '../tags/singleTags';

describe('enzyme-riot-adapter', () => {
  describe('staticTag', () => {
    let wrapper: ShallowWrapper<{}>;

    beforeEach(() => {
      wrapper = shallow({ name: 'static' }, { source: staticTag });
    });

    it('renders html', () => {
      expect(wrapper.html()).toBe('<static><p>Hello, world!</p></static>');
    });

    it('finds by name', () => {
      expect(wrapper.find('p').text()).toBe('Hello, world!');
    });

    it('has no opts', () => {
      expect(wrapper.opts()).toBeUndefined();
    });
  });
});