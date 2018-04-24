import { WeakWrapper } from './index';
import WeakWrapperImpl from './WeakWrapper';
import findElement from '../utils/dom/findElement';

export default function find(selector: string, element: Element): WeakWrapper {
  return new WeakWrapperImpl(findElement(selector, element));
}
