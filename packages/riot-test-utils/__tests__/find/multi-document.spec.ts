import jsdom from 'jsdom';
import { find } from '../../src';

describe('find', () => {
  describe('multi-document', () => {
    it('follow owner documents', () => {
      const element1 = createElement('<div><p>1</p></div>', document);

      let window2 = new jsdom.JSDOM().window;

      const element2 = createElement('<div><p>2</p></div>', window2.document);

      const wrapper1 = find('div', element1);
      const wrapper2 = find('div', element2);
      const wrapper1p = wrapper1.find('p');
      const wrapper2p = wrapper2.find('p');

      expect(element1.ownerDocument).not.toBe(element2.ownerDocument);
      expect(wrapper1.root.ownerDocument).not.toBe(wrapper2.root.ownerDocument);
      expect(wrapper1p.root.ownerDocument).not.toBe(
        wrapper2p.root.ownerDocument
      );
    });
  });
});

function createElement(html: string, document: Document) {
  const element = document.createElement('div');
  element.innerHTML = html;
  return element;
}
