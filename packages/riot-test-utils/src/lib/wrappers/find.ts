import WeakWrapper from './WeakWrapper';

function find(selector: string, element: Element) {
  return new WeakWrapper(element.querySelectorAll(selector));
}

export default find;
