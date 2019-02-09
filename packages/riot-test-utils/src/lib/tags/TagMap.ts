import TagArgs from './TagArgs';

export default interface TagMap {
  /** Mapping name of a tag to its args */
  [name: string]: TagArgs;
}
