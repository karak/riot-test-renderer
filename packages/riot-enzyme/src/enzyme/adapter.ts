import * as React from 'react'; // Only for type definitions.
import { TagOpts } from 'riot';
import { EnzymeAdapter } from 'enzyme';
import RiotShallowRendererProps from './RiotShallowRendererProps';
import { EnzymeNode, EnzymeElement } from './EnzymeNode';
import { ShallowRenderer, TestRenderer } from 'riot-test-utils';
import toReactElement from './toReactElement';
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

  createShallowRenderer(options: RiotShallowRendererProps) {
    const renderer = new ShallowRenderer();
    renderer.loadTags(options['riot-enzyme'].source);
    let cachedNode: React.ReactElement<any> | null = null;

    return {
      render(el: React.ReactElement<any>, context: any) {
        if (!isString(el.type)) throw new Error('el.type must be string');

        cachedNode = el;
        renderer.render(el.type, el.props);
      },
      unmount() {
        renderer.unmount();
      },
      getNode<P>(): EnzymeElement<P> {
        const mountedInstance = renderer.getMountedInstance();
        return {
          nodeType: 'host',
          type: cachedNode!.type,
          props: cachedNode!.props,
          key: cachedNode!.key,
          instance: mountedInstance,
          rendered: elementToTree(toReactElement(mountedInstance)),
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
    const renderer = new TestRenderer();
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

  nodeToElement(
    node: EnzymeElement<TagOpts>
  ): React.ReactElement<TagOpts> | null {
    if (!node || typeof node !== 'object') return null;

    // React.createElement
    // @todo with key and ref
    return { type: node.type, props: node.props, key: node.key };
  }

  elementToNode(element: React.ReactElement<TagOpts>): EnzymeNode {
    return elementToTree(element);
  }

  nodeToHostNode<P>(node: EnzymeElement<P>): Element | null {
    if (!node || typeof node !== 'object') return null;

    return node.instance ? node.instance.root : null;
  }

  isValidElement<P>(element: object): element is React.ReactElement<P> {
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
