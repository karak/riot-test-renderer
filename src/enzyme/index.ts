import {
  configure,
  shallow as reactShallow,
  ShallowWrapper as ReactShallowWrapper,
  EnzymePropSelector,
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

