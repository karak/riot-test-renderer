import {
  configure,
  shallow as reactShallow,
  ShallowRendererProps as ReactShallowRendererProps,
  ShallowWrapper as ReactShallowWrapper,
  EnzymePropSelector,
} from 'enzyme';
import { TagInstance } from 'riot';

import EnzymeRiotAdapter from './adapter';
import RiotShallowRendererProps from './RiotShallowRendererProps';
import toJSON from 'riot-test-utils/dist/lib/toJSON';
import isString from 'lodash/isString';

configure({ adapter: new EnzymeRiotAdapter() });

const SINGLE_TAG_NAME_REGEX = /^[^<]*<(.*?)>/m;

export interface TagOpts {
  [name: string]: any;
}

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
export function shallow<TOpts extends TagOpts>(
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
export function shallow<TOpts extends TagOpts>(
  source: string,
  name: string,
  opts?: TOpts,
  options?: ReactShallowRendererProps
): ShallowWrapper<TOpts | {}>;
export function shallow<TOpts extends TagOpts>(
  source: string,
  ...args: any[]
): ShallowWrapper<TOpts> {
  let name: string;
  let opts: TOpts | undefined;
  let options: ReactShallowRendererProps | undefined;

  if (isString(args[0])) {
    /* Case: source, name, opts?, options?*/
    name = args[0];
    opts = args[1];
    // tslint:disable-next-line:no-magic-numbers
    options = args[2];
  } else {
    /* Case: source, opts?, options?*/
    name = guessNameFromSource(source);
    // tslint:disable-next-line:no-magic-numbers
    opts = args[0];
    // tslint:disable-next-line:no-magic-numbers
    options = args[1];
  }

  const element = {
    type: name,
    props: opts,
    key: null,
  };
  const adaptee = reactShallow(element, {
    'riot-enzyme': { source },
    ...options,
  } as RiotShallowRendererProps);
  return new ShallowWrapper(adaptee);
}

/**
 * Wrapper of shallow-rendered element
 * like {@see enzyme~ShallowWrapper}
 */
export class ShallowWrapper<TOpts extends TagOpts = any> {
  constructor(private adaptee: ReactShallowWrapper<TOpts | undefined>) {}

  unmount() {
    this.adaptee.unmount();
  }

  name(): string {
    return this.adaptee.type() as string;
  }

  opts(): TOpts | {} {
    return this.adaptee.props() || {};
  }

  find(props: EnzymePropSelector): ShallowWrapper<any>;
  find(selector: string): ShallowWrapper<any>;
  find(selector: any) {
    const nextAdaptee = this.adaptee.find(selector) as ReactShallowWrapper<any>;
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
