import { TagInstance, TagOpts } from 'riot';

export type RiotElement = HTMLElement | SVGElement;

export default interface Renderer {
  createInstance(
    name: string,
    opts?: TagOpts,
    children?: ReadonlyArray<RiotElement>
  ): TagInstance;
};
