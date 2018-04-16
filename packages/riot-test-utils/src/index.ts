/* Riot dependency in public APIs */
import { TagInstance, TagOpts, TagRefs, NestedTags } from 'riot';
export { TagInstance, TagOpts, TagRefs, NestedTags };

/* High level APIs */
import shallow from './lib/wrappers/shallow';
import RiotWrapper from './lib/wrappers/RiotWrapper';
export { RiotWrapper, shallow };
export * from './lib/wrappers/mount'; // !!now developing!!

/* Lowlevel APIs */
export * from './lib/renderers';
import Simulate from './lib/Simulate';
export { Simulate };
export * from './lib/transform';
