import * as React from 'react'; // Only for type definitions.
import { EnzymeAdapter } from 'enzyme';
import RiotShallowRendererProps from './RiotShallowRendererProps';
import { EnzymeNode, EnzymeElement } from './EnzymeNode';
import EvalContext from 'riot-test-utils/dist/lib/EvalContext';
import RiotShallowRenderer from 'riot-test-utils/dist/lib/RiotShallowRenderer';
import RiotStaticRenderer from 'riot-test-utils/dist/lib/RiotStaticRenderer';
import renderToStaticMarkup from './renderToStaticMarkup';
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
  private context: EvalContext;

  constructor() {
    super();
    this.options = {
      ...this.options,
      enableComponentDidUpdateOnSetState: true,
    };

    this.context = new EvalContext();
  }

  createMountRenderer(options: any) {
    throw new Error('Not supported yet');
  }

  createShallowRenderer(options: RiotShallowRendererProps) {
    const renderer = new RiotShallowRenderer(this.context);
    renderer.loadTags(options['riot-enzyme'].source);
    let cachedNode: React.ReactElement<any> | null = null;

    return {
      render(el: React.ReactElement<any>, context: any) {
        if (!isString(el.type)) throw new Error('el.type must be string');

        cachedNode = el;
        return renderer.render(el.type, el.props);
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

  createStringRenderer<P>(options: any) {
    const renderer = new RiotStaticRenderer(this.context);
    return {
      render(el: React.ReactElement<P>, context: any): string {
        return renderToStaticMarkup(renderer, el, context);
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

  nodeToElement<P>(node: EnzymeElement<P>): React.ReactElement<P> | null {
    if (!node || typeof node !== 'object') return null;

    return { type: node.type, props: node.props, key: null }; // Not tag but element!
  }

  elementToNode<P>(element: React.ReactElement<P>): EnzymeNode<P> {
    return elementToTree(element);
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
