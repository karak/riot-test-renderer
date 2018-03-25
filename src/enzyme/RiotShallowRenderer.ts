import * as React from 'react'; // Only for type definitions.
import TagInstance from '../lib/TagInstance';
import VirtualDocument from '../lib/VirtualDocument';
import forEach from 'lodash/forEach';
import { VirtualElement, VirtualChild } from '../lib/VirtualElement';
import elementToTree from './elementToTree';
import isString from 'lodash/isString';
import map from 'lodash/map';

/** Shallow renderer compatible to that of React Test Utils */
export default class RiotShallowRenderer {
  private instances: TagInstance<any>[] = [];

  constructor(private vdom: VirtualDocument) {}

  render<P>(component: React.StatelessComponent<P>, props: P) {
    if (typeof component !== 'function') throw new Error('SFC required');

    const tagInstance = component(props)!._tagInstance as TagInstance<P>;
    const root = tagInstance.root!;
    return virtualElementToReactElement(root);
  }

  createReactComponent<TOpts>(
    vdom: VirtualDocument,
    name: React.ComponentClass<TOpts>,
  ): React.Component<TOpts>;
  createReactComponent<TOpts>(
    vdom: VirtualDocument,
    name: string,
  ): React.StatelessComponent<TOpts>;
  createReactComponent<TOpts>(
    vdom: VirtualDocument,
    name: string | React.ComponentClass<TOpts>,
  ): React.Component<TOpts> | React.StatelessComponent<TOpts> {
    if (typeof name !== 'string') throw new Error('Set tag name string');

    return (opts: TOpts) => {
      const tagInstance = vdom.createTag(name, opts);
      tagInstance.mount();
      this.instances.push(tagInstance);
      return ({
        type: tagInstance.root!.name,
        props: tagInstance.opts,
        key: null,
        _tagInstance: tagInstance,
      });
    };
  }

  unmount(): void {
    forEach(this.instances, x => x.unmount());
  }

}

function virtualElementToReactElement(el: string): string;
function virtualElementToReactElement(el: VirtualElement): React.ReactElement<any>;
function virtualElementToReactElement(el: VirtualChild): React.ReactChild {
  if (isString(el)) {
    return el;
  }
  // TODO: if (el.type === 'html')
  return {
    type: el.name,
    props: el.attributes,
    children: map(el.children, x => virtualElementToReactElement(x)),
  };
}
