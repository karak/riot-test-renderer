import TagInstance from '../lib/TagInstance';

export default interface RiotRenderer {
  createInstance<TOpts>(name: string, opts: TOpts): TagInstance<TOpts>;
}
