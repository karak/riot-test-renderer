/** Arguments passed to `riot.tag2()` in `riot-compiler` */
type TagArgs= [
  /** name/id of the new riot tag */
  string,
  /** tag template */
  string,
  /** custom tag css */
  string,
  /** root tag attributes */
  string,
  /** user function */
  () => void
];

export default TagArgs;
