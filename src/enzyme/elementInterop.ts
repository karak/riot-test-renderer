import { VirtualElement, VirtualChild } from '../lib/VirtualElement';
import map from 'lodash/map';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import assign from 'lodash/assign';

export type VirtualElementProps = { [name: string]: any } & {
  children: Array<React.ReactElement<VirtualElementProps> | string>;
};

export function toReactElement(el: VirtualElement, isTag?: boolean): React.ReactElement<VirtualElementProps>;
export function toReactElement(el: string, isTag?: boolean): string;
export function toReactElement(el: VirtualChild, isTag: boolean = false): React.ReactElement<VirtualElementProps> | string {
  if (isString(el) || el === null) return el;

  const attributes = el.attributes;
  const children = map(el.children, toReactElement);
  const props = children.length > 0 ? assign({}, attributes, { children }) : attributes;
  const type = el.name;
  const key = el.key !== undefined ? el.key : null;
  return isTag? { isTag: true, type, props, key } : { type, props, key } as any;
}

export function toVirtualElement(el: React.ReactElement<VirtualElementProps>): VirtualElement;
export function toVirtualElement(el: React.ReactChild): VirtualChild;
export function toVirtualElement(el: React.ReactChild): VirtualChild {
  if (isString(el) || isNumber(el)) return <VirtualChild>el;
  if (el === null || el === undefined) throw new Error('element is null or undefined');
  if (!isString(el.type)) throw new Error('type must be string in Riot');

  const isTag = (el as { isTag?: true }).isTag;
  const { children, ...attributes } = el.props;
  return {
    type: isTag ? 'tag' : 'element',
    attributes,
    children: map(children || [], toVirtualElement),
    name: el.type,
    key: el.key !== null ? el.key : undefined,
  };
}
