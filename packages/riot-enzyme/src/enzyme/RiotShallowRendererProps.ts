import { ShallowRendererProps as ReactShallowRendererProps } from 'enzyme';

export interface ExtraRendererProps {
  'riot-enzyme': {
    source: string;
  };
}

export default interface RiotShallowRendererProps
  extends ReactShallowRendererProps,
    ExtraRendererProps {};
