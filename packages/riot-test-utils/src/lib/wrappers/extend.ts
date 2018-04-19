import { RiotWrapper, WeakWrapper } from '.';
import each from 'lodash/each';

export interface Extension {
  [name: string]: <T>(this: RiotWrapper | WeakWrapper, ...args: any[]) => T;
}

export default function extend(extension: Extension) {
  each(extension, (fn, name) => {
    if (name in RiotWrapper.prototype || name in WeakWrapper.prototype) {
      throw new Error(`"${name}" is already defined in Wrappers`);
    }

    (RiotWrapper.prototype as any)[name] = (WeakWrapper.prototype as any)[
      name
    ] = fn;
  });
}
