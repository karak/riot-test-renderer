import * as React from 'react'; // Only for type definitions.
import { EnzymeAdapter } from 'enzyme';
import {
  TagInstance,
  VirtualElement,
} from '../index';
import EvalContext from '../lib/EvalContext';
import VirtualDocument from '../lib/VirtualDocument';
import {
  TagElement,
  TagNode,
  TagTextNode,
} from '../lib/parseTag';
import RiotShallowRenderer from './RiotShallowRenderer';
import renderToStaticMarkup from './renderToStaticMarkup';
import elementToTree from './elementToTree';
import isString from 'lodash/isString';
import forOwn from 'lodash/forOwn';

declare module 'enzyme' {
  namespace EnzymeAdapter {
    const MODES: {
      MOUNT: string;
      SHALLOW: string;
      STRING: string;
    };
  }

  interface EnzymeAdapter {
    options: {};
  }
}

export type EnzymeNode<P> = React.ReactElement<P> & {
  nodeType: 'host' | 'class' | 'function';
  instance: React.ReactInstance;
  rendered: React.ReactInstance[];
};

function isSFC<P>(
  component: string | React.StatelessComponent<P> | React.ComponentClass<P>,
): component is React.StatelessComponent<P> {
  if (typeof component !== 'function') return false;
  if ('render' in component.prototype) return false;

  return true;
}

function createHTMLElement(
  document: Document,
  name: string,
  attributes: { [name: string]: any },
): HTMLElement {
  const element = document.createElement(name);
  forOwn(attributes, (value, key) => {
    const attr = document.createAttribute(key);
    attr.value = value;
    element.attributes.setNamedItem(attr);
  });
  return element;
}

function createReactElement(
  vdom: VirtualDocument,
  componentType: string | React.StatelessComponent | React.ComponentClass,
  opts: { [name: string]: any },
): React.ReactElement<any> | HTMLElement | null {
  console.log('createReactElement');
  if (isString(componentType)) {
    /*
    if (!vdom.getTagKind(componentType).custom) {
      return createHTMLElement(document, componentType, opts);
    }
    return createHTMLElement(document, 'div', { ...opts, 'data-is': componentType });
    */
   return {
     type: componentType,
     props: opts,
     key: null,
   };
  }
  if (!isSFC(componentType)) throw new Error('Require SFC:' + componentType);

  return componentType(opts);
}

function getNodeType(vdom: VirtualDocument, name: string): 'host' | 'function' | 'class' {
  return vdom.getTagKind(name).custom ? 'function' : 'host';
}

export interface ShallowRendererOptions {
  source: string;
}

export default class EnzymeRiotAdapter extends EnzymeAdapter {
  private context = new EvalContext();
  private vdom = new VirtualDocument(this.context);

  constructor() {
    super();
    this.options = {
      ...this.options,
      enableComponentDidUpdateOnSetState: true,
    };
  }

  createMountRenderer(options: any) {
    throw new Error('Not supported yet');
  }

  createShallowRenderer(options: ShallowRendererOptions) {
    this.vdom.loadTags(options.source);
    const renderer = new RiotShallowRenderer(this.vdom);
    let cachedNode: React.ReactElement<any> | null = null;
    let cachedInstance: React.StatelessComponent<any> | null = null;

    const adapter = this;
    return {
      render<TOpts>(el: React.ReactElement<TOpts>, context: any): undefined | React.ReactInstance {
        cachedNode = el;
        cachedInstance = renderer.createReactComponent(adapter.vdom, el.type as React.SFC<P>);
        return undefined;
      },
      unmount() {
        renderer.unmount();
      },
      getNode<P>(): EnzymeNode<P> {
        console.log('getNode');
        const nodeType = getNodeType(adapter.vdom, cachedInstance!.name);
        const rendered = renderer.render(cachedInstance!, cachedNode!.props);
        console.log(rendered);
        return {
          nodeType,
          type: cachedNode!.type,
          props: cachedNode!.props,
          key: null,
          instance: cachedInstance!,
          rendered: rendered,
        };
      },
      simulateEvent<TEvent>(node: React.ReactInstance, event: TEvent, ...args: any[]) {
        // TODO:
      },
      batchedUpdates(fn: () => void) {
        return fn();
      },
    };
  }

  createStringRenderer(options: any) {
    const adapter = this;
    return {
      render<TOpts>(el: React.ReactElement<TOpts>, context: any): string {
        return renderToStaticMarkup(adapter.vdom, el, context);
      },
    };
  }

  createRenderer(options: { mode: string } & any) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT: return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.SHALLOW: return this.createShallowRenderer(options);
      case EnzymeAdapter.MODES.STRING: return this.createStringRenderer(options);
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }

  nodeToElement<P>(node: EnzymeNode<P>): React.ReactElement<P> | null {
    console.log('N2E');
    console.log(node);
    if (!node || typeof node !== 'object') return null;
    return createReactElement(this.vdom, node.type, node.props);
  }

  elementToNode<TOpts>(element: VirtualElement): any {
    console.log('E2N');
    return elementToTree(element);
  }

  nodeToHostNode<P>(node: RiotInstance): Element {
    console.log('N2HN');
    return { debug: 'HOSTNODE' };
  }

  isValidElement<P>(element: React.ReactElement<P>) {
    console.log('isValidElement');
    return true; // TODO:
  }

  createElement<P>(name: string, props: P, children: React.ReactChild[]): React.StatelessComponent<P> {
    return createReactElement(this.vdom, name, props & { children });
  }
}

