import { shallow, TagInstance } from '../../src';

describe('shallow', () => {
  describe('tags', () => {
    it('renders static tag', () => {
      type TagTags = {
        'my-button': TagInstance,
        'my-item': TagInstance[],
      };
      const wrapper = shallow<{}, {}, TagTags>(`
        <my-button></my-button>
        <my-item></my-item>
        <tag>
          <my-button>Push me!</my-button>
          <my-item>1</my-item>
          <my-item>2</my-item>
        </tag>`,
        'tag'
      );

      expect(wrapper.tags()).toHaveProperty('my-button');
      expect(wrapper.tags()).toHaveProperty('my-item');
      expect(wrapper.tags()['my-button'].root).toBeInstanceOf(Element);
      expect(wrapper.tags()['my-button'].root.textContent).toBe('Push me!');
      expect(wrapper.tags()['my-item']).toHaveLength(2);
      expect(wrapper.tags()['my-item'][0].root).toBeInstanceOf(Element);
      expect(wrapper.tags()['my-item'][0].root.textContent).toBe('1');
      expect(wrapper.tags()['my-item'][1].root).toBeInstanceOf(Element);
      expect(wrapper.tags()['my-item'][1].root.textContent).toBe('2');
    });
  });
});
