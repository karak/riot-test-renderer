import * as React from 'react'; // Only for type definitions.
import { EnzymeAdapter } from 'enzyme';
import { EnzymeNode, EnzymeElement } from './EnzymeNode';
import { mapNativeEventNames } from './utils/index';
import EvalContext from '../lib/EvalContext';
import VirtualDocument from '../lib/VirtualDocument';
import { VirtualElement, VirtualChild } from '../lib/VirtualElement';
import TagInstance from '../lib/TagInstance';
import RiotShallowRenderer from '../lib/RiotShallowRenderer';
import RiotStaticRenderer from '../lib/RiotStaticRenderer';
import renderToStaticMarkup from './renderToStaticMarkup';
import elementToTree from './elementToTree';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import assign from 'lodash/assign';
import map from 'lodash/map';

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

export interface ShallowRendererOptions {
  source: string;
}

export default class EnzymeRiotAdapter extends EnzymeAdapter {
  private vdom: VirtualDocument;

  constructor() {
    super();
    this.options = {
      ...this.options,
      enableComponentDidUpdateOnSetState: true,
    };

    this.vdom = new VirtualDocument(new EvalContext());
  }

  createMountRenderer(options: any) {
    throw new Error('Not supported yet');
  }

  createShallowRenderer(options: ShallowRendererOptions) {
    const renderer = new RiotShallowRenderer(this.vdom);
    renderer.loadTags(options.source);
    let cachedNode: React.ReactElement<any> | null = null;

    const adapter = this;
    return {
      render<P>(el: React.ReactElement<P>, context: any): React.ReactElement<P> {
        if (!isString(el.type)) throw new Error('el.type must be string');

        cachedNode = el;
        return toReactElement(renderer.render(el.type, el.props));
      },
      unmount() {
        renderer.unmount();
      },
      getNode<P>(): EnzymeElement<P> {
        const output = renderer.getRenderedOutput();
        const mountedInstance = renderer.getMountedInstance();
        return {
          nodeType: 'host',
          type: cachedNode!.type,
          props: cachedNode!.props,
          key: cachedNode!.key,
          instance: mountedInstance,
          rendered: elementToTree(output),
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
    const renderer = new RiotStaticRenderer(this.vdom);
    return {
      render<TOpts>(el: React.ReactElement<TOpts>, context: any): string {
        return renderToStaticMarkup(renderer, el, context);
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
    if (!node || typeof node !== 'object') return null;
    return toReactElement(node.instance!.root!); // TODO:
  }

  elementToNode<P>(element: React.ReactElement<P>): EnzymeNode<P> {
    return elementToTree(toVirtualElement(element)); // TODO:
  }

  nodeToHostNode<P>(node: EnzymeElement<P>): Element | null {
    if (!node || typeof node !== 'object') return null;
    return node.instance!.root || null; // TODO:
  }

  isValidElement<P>(element: React.ReactElement<P>) {
    return true; // TODO:
  }

  createElement<P>(name: string, props: P, children: React.ReactChild[]): React.ReactElement<P> {
    return {
      type: name,
      props: assign({}, props, { children }),
      key: null,
    };
  }
}

function toReactElement(el: VirtualElement): React.ReactElement<any> {
  return {
    type: el.name,
    props: assign({}, el.attributes, { children: el.children }),
    key: el.key !== undefined ? el.key : null,
  };
}
function toVirtualElement<P>(el: React.ReactElement<P>): VirtualElement;
function toVirtualElement(el: React.ReactChild): VirtualChild;
function toVirtualElement(
  el: React.ReactChild,
): VirtualChild {
  if (isString(el) || isNumber(el)) return <VirtualChild>el;

  const { children, ...attributes } = el.props;
  return {
    attributes,
    children: map(children || [], toVirtualElement),
    type: 'html',
    name: el.type as string,
    key: el.key !== null ? el.key : undefined,
  };
}
