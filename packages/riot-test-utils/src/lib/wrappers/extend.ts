import { TagOpts, TagRefs, NestedTags } from 'riot';
import { default as RiotWrapperImpl } from './RiotWrapper';
import { default as WeakWrapperImpl } from './WeakWrapper';
import { WrapperExtensions } from '../../';
import each from 'lodash/each';

/** Definitions of extension methods for {@see extend} */
export interface Extension {
  [name: string]: Function;
}

/**
 * Extend exsisting wrapper APIs.
 *
 * **EXPERIMENTAL**
 */
export function extend(extension: Extension): void {
  each(extension, (fn, name) => {
    if (
      name in RiotWrapperImpl.prototype ||
      name in WeakWrapperImpl.prototype
    ) {
      throw new Error(`"${name}" is already defined in Wrappers`);
    }

    (RiotWrapperImpl.prototype as any)[
      name
    ] = (WeakWrapperImpl.prototype as any)[name] = fn;
  });
}

export interface RiotWrapper<
  TOpts extends TagOpts = TagOpts,
  TRefs extends TagRefs = TagRefs,
  TTags extends NestedTags = NestedTags
> extends RiotWrapperImpl<TOpts, TRefs, TTags>, WrapperExtensions {}

export interface WeakWrapper extends WeakWrapperImpl, WrapperExtensions {}
