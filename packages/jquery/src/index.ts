import { extend, RiotWrapper, WeakWrapper } from 'riot-test-utils';
import { default as $ } from 'jquery';
import each from 'lodash/each';

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


const names = [
  'is',
];

each(names, name => {
  jqueryExtension[name] = function (this: RiotWrapper | WeakWrapper) {
    const $el = toJQuery(this);
    return ($el as any)[name].apply($el, arguments);
  };
});

/* Do extend */
extend(jqueryExtension)

/* Modify type definition */
declare module 'riot-test-utils' {
  interface WrapperExtensions {
    is: typeof $.prototype.is;
  }
}
