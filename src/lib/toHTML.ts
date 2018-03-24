import {
  VirtualElement,
  VirtualChild,
} from './VirtualElement';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import map from 'lodash/map';
import escapeHTML from '../utils/escapeHTML';

/**
 * Create HTML string
 *
 * @param deep select deep or shallow, default is false
 */
export default function toHTML(element: VirtualElement, deep: boolean = true): string {
  if (deep) throw new Error('Not implemented');

  if (isString(element)) {
    return escapeHTML(element);
  }

  const name = element.name;
  const attributes = attributesToHTML(element.attributes);
  const children = map(element.children, x => toHTML(x, deep));

  return `<${name}${attributes? ' ' + attributes : ''}>${children.join('')}</${name}>`;
}


function attributesToHTML(attributes?: { [name: string]: any }) {
  return map(attributes || {}, (value, key) => {
    if (isString(value)) {
      return `${escapeHTML(key)}="${escapeHTML(value)}"`;
    }
    if (value === true) {
      return escapeHTML(key);
    }
    if (value === false || value === undefined) {
      return '';
    }
    if (isNumber(value)) {
      return `${escapeHTML(key)}="${value}"`;
    }

    const stringifiedValue = `${value}`;
    return `${escapeHTML(key)}="${escapeHTML(stringifiedValue)}"`;
  }).join(' ');
}
