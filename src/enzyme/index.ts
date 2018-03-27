import {
  configure,
  shallow as reactShallow,
  ShallowRendererProps as ReactShallowRendererProps,
  ShallowWrapper as ReactShallowWrapper,
  EnzymePropSelector,
} from 'enzyme';

import EnzymeRiotAdapter from './adapter';

configure({ adapter: new EnzymeRiotAdapter() });

/** Options of {@see shallow} */
type RiotShallowRendererProps = ReactShallowRendererProps & {
  /** tag sources */
  source: string;
}

/**
 * Shallow render
 *
 * @param source tag source
 * @param name tag name
 * @param opts tag interface
 * @param options renderer options see {@see enzyme~shallow}
 * @returns wrapper object of rendered element.
 */
export function shallow<TOpts>(source: string, name: string, opts?: TOpts, options?: ReactShallowRendererProps): ShallowWrapper<TOpts> {
  const adaptee = reactShallow(
    { type: name, props: opts || {}, key: null },
    { source, ...options } as RiotShallowRendererProps,
  );
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
}

