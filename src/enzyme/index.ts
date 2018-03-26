import {
  configure,
  shallow as reactShallow,
  ShallowWrapper as ReactShallowWrapper,
} from 'enzyme';

import EnzymeRiotAdapter from './adapter';

configure({ adapter: new EnzymeRiotAdapter() });

/** {@see shallow} */
export interface RiotElement<TOpts> {
  name: string;
  opts?: TOpts;
}
/** Options of {@see shallow} */
export interface RiotShallowRendererOptions {
  /** tag sources */
  source: string;
}

export function shallow<TOpts>(el: RiotElement<TOpts>, options: RiotShallowRendererOptions) {
  const adaptee = reactShallow(
    {
      type: el.name,
      props: el.opts || {},
      key: null,
    },
    options as {},
  );
  return new ShallowWrapper(adaptee);
}

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

  find(selector: string) {
    return new ShallowWrapper(this.adaptee.find(selector));
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

