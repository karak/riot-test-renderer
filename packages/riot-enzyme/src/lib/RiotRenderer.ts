import TagInstance from '../lib/TagInstance';
import { VirtualChild } from '../lib/VirtualElement';

export default interface RiotRenderer {
  createInstance<TOpts>(name: string, opts: TOpts, children: ReadonlyArray<VirtualChild>): TagInstance<TOpts>;
};
