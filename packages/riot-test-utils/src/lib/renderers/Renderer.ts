import { TagInstance, TagOpts } from 'riot';
import MountOptions from './MountOptions';

export type RiotElement = HTMLElement | SVGElement;

export default interface Renderer {
  createInstance(
    name: string,
    opts?: TagOpts,
    children?: ReadonlyArray<RiotElement>,
    options?: MountOptions,
  ): TagInstance;
};
