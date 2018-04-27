// tslint:disable:no-eval
import TagMap from './TagMap';
import TagArgs from './TagArgs';
import { tag } from 'riot';
import each from 'lodash/each';

/** eval alternative by IIFE to retrieve script section of the tag */
function iifeEval(this: EvalContext, tagjs: string): [{ [tagName: string]: Function }, string[]]  {
  return (new Function(
    `var t={},s=[],riot={tag2:function(n){t[n]=arguments;s.push(n);return n}};${tagjs};return[t,s];`
  )).apply(this, []);
}

// @TODO: use Module in serverside.

/**
 * Unifiyed `this` object during riot.compile().
 *
 * Note top level script in a tag is executed on compilation.
 */
export default class EvalContext {
  evalTag(tagjs: string) {
    const [tags, tagNames] = iifeEval.apply(this, [tagjs]);

    each(tags, (x: TagArgs) => tag.apply(this, x));

    return {
      tags: tags as TagMap,
      tagNames: tagNames as string[],
    };
  }
}
