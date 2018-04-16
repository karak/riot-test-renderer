import { TagInstance, TagOpts } from 'riot';

export type RiotElement = HTMLElement | SVGElement;

export default interface RiotRenderer {
  createInstance(
    name: string,
    opts?: TagOpts,
    children?: ReadonlyArray<RiotElement>
  ): TagInstance;
};
