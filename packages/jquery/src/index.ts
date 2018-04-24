import { extend, RiotWrapper, WeakWrapper } from 'riot-test-utils';
import { default as $ } from 'jquery';

function isRiotWrapper(wrapper: RiotWrapper | WeakWrapper): wrapper is RiotWrapper {
  return wrapper.instance !== null;
}

function toJQuery(wrapper: RiotWrapper | WeakWrapper): JQuery {
    return $(isRiotWrapper(wrapper) ? wrapper.root : wrapper.get())
}

/** An extension methods with jQuery */
const jqueryExtension: {
  [name: string]: Function;
} = {};

jqueryExtension.is = function (this: RiotWrapper | WeakWrapper, arg: any) {
  return toJQuery(this).is(arg);
};

/* Do extend */
extend(jqueryExtension)

/* Modify type definition */
declare module 'riot-test-utils' {
  interface WrapperExtensions {
    is: typeof $.prototype.is;
  }
}
