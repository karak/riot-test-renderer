/* Riot dependency in public APIs */
export { TagInstance, TagOpts, TagRefs, NestedTags } from 'riot';

/* High level APIs */
export {
  RiotWrapper,
  WeakWrapper,
  mount,
  shallow,
  find,
  extend,
} from './lib/wrappers';

/* Low level APIs */
export * from './lib/renderers';
import Simulate from './lib/Simulate';
export { Simulate };
export * from './lib/transform';

/****************************************************************/
/* Extension mechanics                                          */
/****************************************************************/

/*
 * Extension declarations open to library users.
 *
 * @example
 * declare interface WrapperExtensions {
 *   myExtensionFunction(): string;
 * }
 */
export interface WrapperExtensions {}

/*
 * Don't move {@see WrapperExtensions} from 'index.ts'
 * so that extensions can add their methods to it.
 */
