import * as React from 'react'; // Only for type definitions.
import { EnzymeAdapter } from 'enzyme';
import RiotShallowRendererProps from './RiotShallowRendererProps';
import { EnzymeNode, EnzymeElement } from './EnzymeNode';
import EvalContext from '../lib/EvalContext';
import VirtualDocument from '../lib/VirtualDocument';
import RiotShallowRenderer from '../lib/RiotShallowRenderer';
import RiotStaticRenderer from '../lib/RiotStaticRenderer';
import renderToStaticMarkup from './renderToStaticMarkup';
import {
  toReactElement,
  toVirtualElement,
  VirtualElementProps,
} from './elementInterop';
import elementToTree from './elementToTree';
import isString from 'lodash/isString';
import assign from 'lodash/assign';

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

  createShallowRenderer(options: RiotShallowRendererProps) {
    const renderer = new RiotShallowRenderer(this.vdom);
    renderer.loadTags(options['riot-enzyme'].source);
    let cachedNode: React.ReactElement<any> | null = null;

    return {
      render(
        el: React.ReactElement<VirtualElementProps>,
        context: any
      ): React.ReactElement<VirtualElementProps> {
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
      simulateEvent<TEvent>(
        node: React.ReactInstance,
        event: TEvent,
        ...args: any[]
      ) {
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
      render(
        el: React.ReactElement<VirtualElementProps>,
        context: any
      ): string {
        return renderToStaticMarkup(renderer, toVirtualElement(el), context);
      },
    };
  }

  createRenderer(options: { mode: string } & any) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT:
        return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.SHALLOW:
        return this.createShallowRenderer(options);
      case EnzymeAdapter.MODES.STRING:
        return this.createStringRenderer(options);
      default:
        throw new Error(
          `Enzyme Internal Error: Unrecognized mode: ${options.mode}`
        );
    }
  }

  nodeToElement<P>(
    node: EnzymeElement<P>
  ): React.ReactElement<VirtualElementProps> | null {
    if (!node || typeof node !== 'object') return null;

    const root = (node as any).instance!.root;
    return toReactElement(root, false); // Not tag but element!
  }

  elementToNode<P>(
    element: React.ReactElement<VirtualElementProps>
  ): EnzymeNode<P> {
    return elementToTree(toVirtualElement(element));
  }

  nodeToHostNode<P>(node: EnzymeElement<P>): Element | null {
    if (!node || typeof node !== 'object') return null;

    throw new Error('Not implemented');

    // TODO: return findDOMNode(node.instance!)
  }

  isValidElement<P>(element: React.ReactElement<P>) {
    return true; // TODO:
  }

  createElement<P>(
    name: string,
    props: P,
    children: React.ReactChild[]
  ): React.ReactElement<P> {
    return {
      type: name,
      props: assign({}, props, { children }),
      key: null,
    };
  }
}
