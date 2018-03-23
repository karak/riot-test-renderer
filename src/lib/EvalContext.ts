// tslint:disable:no-eval
import TagMap from './TagMap';

/**
 * Unifiyed `this` object during riot.compile().
 *
 * Note top level script in a tag is executed on compilation.
 */
export default class EvalContext {
  evalTag(tagjs: string) {
    const code =
    `var t={},s=[],riot={tag2:function(n){t[n]=arguments;s.push(n);return n}};${tagjs};[t,s];`;
    const [tags, names] = eval(code) as [TagMap, string[]];
    return { tags, names };
  }
}
