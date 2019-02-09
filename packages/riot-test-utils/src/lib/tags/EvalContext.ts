// tslint:disable:no-eval
import TagMap from './TagMap';
import { tag } from 'riot';
import each from 'lodash/each';

/**
 * Unifiyed `this` object during riot.compile().
 *
 * Note top level script in a tag is executed on compilation.
 */
export default class EvalContext {
  evalTag(tagjs: string) {
    // @TODO: use Module in serverside.
    const [tags, tagNames] = eval(
      `var t={},s=[],riot={tag2:function(n){t[n]=arguments;s.push(n);return n}};${tagjs};[t,s];`
    );

    each(tags, x => tag.apply(this, x));

    return {
      tags: tags as TagMap,
      tagNames: tagNames as string[],
    };
  }
}
