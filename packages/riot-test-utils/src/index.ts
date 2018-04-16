/* Riot dependency in public APIs */
import { TagInstance, TagOpts, TagRefs, NestedTags } from 'riot';
export {
  TagInstance,
  TagOpts,
  TagRefs,
  NestedTags,
}

/* High level APIs */
import shallow from './lib/shallow';
import ShallowWrapper from './lib/ShallowWrapper';
export {
  ShallowWrapper,
  shallow,
};
export * from './lib/mount'; // !!now developing!!

/* Lowlevel APIs */
export * from './lib/renderers';
import Simulate from './lib/Simulate';
export { Simulate };
export * from './lib/transform';
