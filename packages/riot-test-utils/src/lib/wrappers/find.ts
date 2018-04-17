import WeakWrapper from './WeakWrapper';
import findElement from '../utils/dom/findElement';

export default function find(selector: string, element: Element) {
  return new WeakWrapper(findElement(selector, element));
}
