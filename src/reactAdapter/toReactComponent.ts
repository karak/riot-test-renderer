import * as React from 'react';
import VirtualDocument from '../lib/VirtualDocument';
import { VirtualChild, VirtualElement } from '../lib/VirtualElement';
import { TagNode, TagTextNode, TagElement } from '../lib/parseTag';
import TagInstance, { createTag } from '../lib/TagInstance';
import map from 'lodash/map';

export interface RiotTagProps<TOpts> {
  opts: TOpts;
  data: any;
}

export default function ToReactComponent<TOpts>(
  vdom: VirtualDocument,
  tagNode: TagElement,
  onCreate: () => void,
): React.ComponentClass<RiotTagProps<TOpts>> | React.SFC<RiotTagProps<TOpts>> {
  const componentClass = class RiotTagComponent
    extends React.Component<RiotTagProps<TOpts>, any>
  {
    private tagInstance: TagInstance<TOpts>;

    constructor(props: { opts: TOpts, data: any }, context: any) {
      super(props, context);
      this.tagInstance = createTag(vdom, tagNode, this.props.opts, onCreate);
    }

    componentDidMount() {
      this.tagInstance.mount();
    }

    comonentDidUnmount() {
      this.tagInstance.unmount();
    }

    render(): React.ReactElement<any> & { children: React.ReactNode } {
      const root = this.tagInstance.root!;
      return {
        type: componentClass,
        props: root.attributes,
        key: null,
        children: map(root.children), // TODO: move to createReactElement
      };

      function renderChild(child: VirtualChild): React.ReactChild {
        if (vdom.getTagKind(tagNode.name).custom) {
          // TODO:
        }

        return {
          type: tagNode.name,
          props: tagNode.attributes,
          key: null,
          children: map(tagNode.children, renderChild), // TODO: move to createReactElement
        }
      }
    }
  };

  (componentClass as any).displayName = tagNode.name;

  return componentClass;
}
