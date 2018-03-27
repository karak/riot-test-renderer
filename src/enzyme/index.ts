import {
  configure,
  shallow as reactShallow,
  ShallowRendererProps as ReactShallowRendererProps,
  ShallowWrapper as ReactShallowWrapper,
  EnzymePropSelector,
} from 'enzyme';

import EnzymeRiotAdapter from './adapter';
import RiotShallowRendererProps from './RiotShallowRendererProps';
import TagInstance from '../lib/TagInstance';
import toJSON from '../lib/toJSON';
import isString from 'lodash/isString';

configure({ adapter: new EnzymeRiotAdapter() });

const SINGLE_TAG_NAME_REGEX = /^[^<]*<(.*?)>/m;

/**
 * Guess its name from single tag source
 * without real compilation
 *
 * @param singleSource tag source which may be contain single tag
 * @returns tag name
 * @throws {Error} if no tag expression is found
 */
function guessNameFromSource(singleSource: string): string {
  const m = SINGLE_TAG_NAME_REGEX.exec(singleSource);
  if (m === null) throw new Error('No tag expression with <>');

  return m[1];
}

/**
 * Shallow render
 *
 * @param singleSource tag source which contains single tag
 * @param opts tag interface
 * @param options renderer options see {@see enzyme~shallow}
 * @returns wrapper object of rendered element.
 */
export function shallow<TOpts>(
  singleSource: string,
  opts?: TOpts,
  options?: ReactShallowRendererProps
): ShallowWrapper<TOpts>;
/**
 * Shallow render
 *
 * @param source tag source
 * @param name tag name
 * @param opts tag interface
 * @param options renderer options see {@see enzyme~shallow}
 * @returns wrapper object of rendered element.
 */
export function shallow<TOpts>(
  source: string,
  name: string,
  opts?: TOpts,
  options?: ReactShallowRendererProps
): ShallowWrapper<TOpts>;
export function shallow<TOpts>(
  source: string,
  ...args: any[]
): ShallowWrapper<TOpts> {
  let name: string;
  let opts: TOpts | undefined;
  let options: ReactShallowRendererProps | undefined;

  if (isString(args[0])) {
    name = args[0];
    opts = args[1];
    // tslint:disable-next-line:no-magic-numbers
    options = args[2];
  } else {
    name = guessNameFromSource(source);
    // tslint:disable-next-line:no-magic-numbers
    opts = args[2];
    // tslint:disable-next-line:no-magic-numbers
    options = args[3];
  }

  const adaptee = reactShallow({ type: name, props: opts || {}, key: null }, {
    'riot-enzyme': { source },
    ...options,
  } as RiotShallowRendererProps);
  return new ShallowWrapper(adaptee);
}

/**
 * Wrapper of shallow-rendered element
 * like {@see enzyme~ShallowWrapper}
 */
export class ShallowWrapper<TOpts = any> {
  constructor(private adaptee: ReactShallowWrapper) {}

  unmount() {
    this.adaptee.unmount();
  }

  name(): string {
    return this.adaptee.type() as string;
  }

  opts(): TOpts {
    return this.adaptee.props() as TOpts;
  }

  find(props: EnzymePropSelector): ShallowWrapper<any>;
  find(selector: string): ShallowWrapper<any>;
  find(selector: any) {
    const nextAdaptee = this.adaptee.find(selector);
    return new ShallowWrapper(nextAdaptee);
  }

  at(index: number) {
    return new ShallowWrapper(this.adaptee.at(index));
  }

  text() {
    return this.adaptee.text();
  }

  html() {
    return this.adaptee.html();
  }

  toJson(): object | null {
    const root = ((this.adaptee.instance() as any) as TagInstance).root;
    return toJSON(root !== undefined ? root : (null as any)) as object | null;
  }
}
