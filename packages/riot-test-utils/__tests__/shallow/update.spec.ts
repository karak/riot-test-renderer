import { shallow, ShallowWrapper } from '../../src';

describe('shallow', () => {
  describe('update', () => {
    const opts = { greeting: 'Good morning!' };
    let wrapper: ShallowWrapper<typeof opts>;

    beforeEach(() => {
      wrapper = shallow(`
      <tag>
        <p>{ greeting }</p>
        <script>
        this.greeting
        </script>
      </tag>
      `, opts);
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('update after change', () => {
      wrapper.instance.greeting = 'Good evening!';
      // Don't assign to wrapper.greeting
      wrapper.update();

      expect(wrapper.html()).toBe('<tag data-is="tag"><p>Good evening!</p></tag>');
    });

    it('update with an argument', () => {
      wrapper.update({ greeting: 'Good evening!' });

      expect(wrapper.html()).toBe('<tag data-is="tag"><p>Good evening!</p></tag>');
    });
  });
});
