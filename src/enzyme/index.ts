import {
  configure,
  shallow as reactShallow,
  ShallowWrapper as ReactShallowWrapper,
} from 'enzyme';
import {
  RiotElement,
  RiotShallowRendererOptions,
} from './types';

import EnzymeRiotAdapter from './adapter';

configure({ adapter: new EnzymeRiotAdapter() });

export function shallow(el: RiotElement, options: RiotShallowRendererOptions) {
  const adaptee = reactShallow(
    { type: el.name, props: el.opts || {}, key: 0 },
    options as {},
  );
  return new ShallowWrapper(adaptee);
}

export class ShallowWrapper<TOpts = any> {
  constructor(private adaptee: ReactShallowWrapper) {}

  unmount() {
    this.adaptee.unmount();
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

