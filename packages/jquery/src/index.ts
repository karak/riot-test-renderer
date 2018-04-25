import { extend, RiotWrapper, WeakWrapper } from 'riot-test-utils';
import { default as $ } from 'jquery';

function isRiotWrapper(
  wrapper: RiotWrapper | WeakWrapper
): wrapper is RiotWrapper {
  return wrapper.instance !== null;
}

function toJQuery(wrapper: RiotWrapper | WeakWrapper): JQuery {
  return $(isRiotWrapper(wrapper) ? wrapper.root : wrapper.get());
}

/** An extension methods with jQuery */
const jqueryExtension: {
  [name: string]: Function;
} = {};

/** Add the method to get jQuery object($()) */
function addWrap() {
  jqueryExtension['$'] = function(this: RiotWrapper | WeakWrapper) {
    return toJQuery(this);
  };
}

/** Add a method of query that returns boolean value */
function addQuery(name: string) {
  jqueryExtension[name] = function(this: RiotWrapper | WeakWrapper) {
    const $el = toJQuery(this);
    return ($el as any)[name].apply($el, arguments);
  };
}

/** Add a method of accessor */
function addAccessor(name: string, isSetter = isSetterDefault) {
  jqueryExtension[name] = function(this: RiotWrapper | WeakWrapper) {
    const $el = toJQuery(this);
    if (!isSetter.apply(this, arguments)) {
      return ($el as any)[name].apply($el, arguments);
    } else {
      ($el as any)[name].apply($el, arguments);
      return this;
    }
  };
}

function isSetterDefault(this: JQuery) {
  return arguments.length > 1;
}

/* Get jQuery itself */
addWrap();

/* Assertion helpers */
addQuery('is');
addQuery('hasClass');
addAccessor('attr');
addAccessor('css', function() {
  return arguments.length > 1 || typeof arguments[0] === 'object';
});
addAccessor('data');
addAccessor('prop');
addAccessor('value');

/* Do extend */
extend(jqueryExtension);

/* TODO: DOM manipulation methods like filter, has, find, children */

/* Modify type definition */
declare module 'riot-test-utils' {
  interface WrapperExtensions {
    $(): JQuery;
    is: typeof $.prototype.is;
    hasClass: typeof $.prototype.hasClass;
    attr: typeof $.prototype.attr;
    css: typeof $.prototype.css;
    data: typeof $.prototype.data;
    prop: typeof $.prototype.prop;
    value: typeof $.prototype.value;
  }
}
