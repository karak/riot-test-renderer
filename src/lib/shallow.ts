import ShallowWrapper from './ShallowWrapper';
import ShallowRenderer from './ShallowRenderer';
import keys from 'lodash/keys';

/**
 * A shallow renderer for `riot`
 *
 * @param src - source string to define tag(s).
 * @param name - tagName. You can skip this if src contains a single tag.
 * @param opts - opts to create tag with
 */
function shallow<TOpts>(src: string, name: string, opts?: TOpts): ShallowWrapper<TOpts>;
function shallow<TOpts>(src: string, opts?: TOpts): ShallowWrapper<TOpts>;
function shallow<TOpts>(): ShallowWrapper<TOpts> {
  let src: string;
  let tagName: string | undefined;
  let opts: TOpts | undefined;
  // compile
  // tslint:disable-next-line:no-magic-numbers
  if (arguments.length === 3) {
    [src, tagName, opts] = <any>(arguments);
  // tslint:disable-next-line:no-magic-numbers
  } else if (arguments.length === 2) {
    if (typeof (arguments[1]) === 'string') {
      [src, tagName, opts] = <any>(arguments);
    } else {
      [src, opts] = <any>(arguments);
    }
  } else {
    [src] = <any>(arguments);
  }

  const renderer = new ShallowRenderer();
  renderer.loadTags(src);

  // Select tagName when single tag use.
  if (tagName === undefined) {
    const tagNames = keys(renderer.tags);
    if (tagNames.length !== 1) throw new Error('Tag source must be single');

    tagName = tagNames[0] as string;
  }

  // create tag
  return renderer.shallow(tagName, opts);
}

export default shallow;
