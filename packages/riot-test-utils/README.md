Riot-test-utils
===============

This provides lightweight testing of `Riot` tags.

It is highly inspired by [`React-test-utils`](https://reactjs.org/docs/test-utils.html) [`Enzyme`](https://github.com/airbnb/enzyme), great testing utility for [`React`](https://reactjs.org/).

Shallow-rendering is provided by [`Riot-shallowize`](https://www.npmjs.com/package/riot-shallowize) including the limitation about transclusions.

Features:

- Shorter way to setup unit-testing of tags.
- Wrapper API of an instance of tags to inspect easily
- DOM Traversing API similar to jQuery
- *Shallow-rendering*.
- Snapshot testing

This library is being developing and have **breaking changes** even if minor update. Any contributions are welcome!

Installation
------------

Install via `npm`:

```bash
npm install -D riot-test-utils
```

UMD module is also available.
For example loading from CDN like jsdelivr is like:

```html
<script src="https://cdn.jsdelivr.net/npm/riot@3.9/riot.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/riot-test-utils@1.1.0/dist/index.umd.min.js"></script>
```

Dependent packages `riot-shallowize`, `simulate-event` and other utilities are bundled in UMD.

Usage
-----

Import as:

```js
// es5/commonjs
var mount = require('riot-test-utils').mount;

// es6
import { mount } from 'riot-test-utils';
```

Create wrapper for the tag to test as:

```js
var wrapper = mount('tag');

var wrapperWithOpts = mount('tag-with-opts', { title: 'RiotJS' });
```

and look outerHTML:

```js
assert(wrapper.html() === '<tag data-is="tag"><p>Hello, world!</p></tag>');
```

Templating also works.

```js
var wrapper = mount('<tag><p>{opts.greeting}</p></tag>', { greeting: 'Hello, world!' });

assert(wrapper.html() === '<tag data-is="tag"><p>Hello, world!</p></tag>');
```

### Embedding style

We can write single tag source in the following style:

```js
var wrapper = mount('<tag><p>Hello, world!</p></tag>');
```

Specify the name to test when you have multiple tags:

```js
var wrapper = mount(
  [
    '<tag1><tag2 /></tag1>',
    '<tag2><p>Hello, world!</p></tag2>',
  ].join('\n'),
  'tag1'
);
```

### Shallow rendering

This library provides great **shallow-rendering** feature as `React-test-utils`.

It truly separates your tests of one tag from the others.

For example:

```js
var shallow = require('react-test-utils').shallow;

var wrapper = shallow(
  [
    '<inner><p>{opts.data}</p></inner>',
    '<outer><inner data={ opts.innerData }/></outer>'
  ].join('\n'),
  'outer',
  { innerData: 'Hello!' }
);
```

This is *shallow* rendered as:

```js
assert(wrapper.html() === '<outer data-is="outer"><inner data="Hello!"></inner></outer>');
```

Of course, you can mount by name being registered.

```js
var wrapper = shallow('outer', { innerData: 'Hello!' });
```

DOM testing
-----------

You can get DOM Element by `root`.

Then, you can inspect by DOM API or some utility like jQuery.

```js
var wrapper = mount('tag', { greeting: 'Hellow, world' });

// find by DOM API
assert(wrapper.root.querySelector('p').textContent === 'Hellow, world' );

// find by jQuery
assert($(wrapper.root).find('p').text() === 'Hello, world');
```

And gather internal elements by `find()` method and inspect them.

```js
const itemsWrapper = wrapper.find('ul.todo-list > li');

assert(itemsWrapper.length === 5);
assert(itemsWrapper.get(0).text() === 'Buy a car');
```

Snapshot testing
----------------

You can use `toJSON()` to use **[snapshot-testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html)**
to keep your tags.

With `jest` for example:

```js
it('should match snapshot', function () {
  var wrapper = shallow('<tag><h1>Example:</h1><p>Hello, world!</p></tag>');

  expect(wrapper.toJSON()).toMatchSnapshot();
});
```

Then, you will see the following result if different:

```diff
  <tag
    data-is={
      Array [
        "tag"
      ]
    }
  >
-   Hello, world!
+   <h1>
+     Example:
+   </h1>
+   <p>
+     Hello, world!
+   </p>
  </tag>
```

Public API
----------

### Module

#### mount(tagName, [opts])
#### mount(singleTagSource, [opts])
#### mount(multipleTagSource, tagName, [opts])

Mount a tag with full-rendering.

#### shallow(tagName, [opts])
#### shallow(singleTagSource, [opts])
#### shallow(multipleTagSource, tagName, [opts])

Mount a tag with shallow-rendering.

They return `RiotWrapper`.

### RiotWrapper

Wrapper of tag instance to be mounted or shallow-mounted.

#### instance

Get `TagInstance` of root.

#### root

Get root DOM Element.

It is equivalent to `instance.root`.

#### opts

Get opts, including "data-is" attribute added during rendering.

It is equivalent to `instance.opts`.

#### parent

Get the parent tag instance.

It is equivalent to `instance.parent` and always `null`.

#### tags

Get nested tags.

It is equivalent to `instance.tags`.

#### refs

Get refs.

It is equivalent to `instance.refs`.

#### on(event, callback)
#### one(event, callback)
#### trigger(event, ...args)
#### off(event, [callback])

All the observable methods.

It is equivalent to `instance,on()` and the others but returns the wrapper itself.

Note: `this` is always the unwrapped instance in callbacks.

#### isMounted

Get the flag if the tag is mounted or not.

It is equivalent to `instance.isMounted`.

#### mount()

Mount the tag.

Note it is already mounted initially.

It is equivalent to `instance.mount()`.

#### unmount([keepTheParent])

Unmount the tag.

It is equivalent to `instance.unmount()`.

#### update([data])

Update the tag and its children.

It is equivalent to `instance.update()`.

#### mixin(mixin)

Apply mixin to the tag.

It is equivalent to `instance.mixin()`.

#### find(selector)

Find internal elements by CSS selector.

This returns `WeakWrapper`

#### html()

Get outer HTML by string.

#### text()

Get internal concatenated text.

#### toJSON()

Get json form to create snapshot

#### simulate(eventType, [options])

Fire event.

For example:

```js
wrapper.simulate('click');
```

```js
wrapper.simulate('keyup', { key: 'a', keyCode: 97, metaKey: true });
```

All the events are listed in [source](./src/lib/Simulate/eventTypes.ts).

### WeakWrapper

Wrapper of DOM elements to be found.

#### instance

Tag instance. This always returns `null`.

#### root

**Throws** unless wrapped elements are single.

#### length

Get number of wrapped elements.

#### get([index])

Get wrapped element(s) as `Element` or array of `Element`.

#### find(selector)

Find more under the wrapped element(s) by CSS selector.

#### text()

#### html()

#### toJSON()

Contents APIs above are supported as well as `RiotWrapper`, but first two methods **throws** unless single.

#### simulate(eventType, [options])

Fire event.

If wrapper has multiple elements, it fires each element in the order of appearance.

Enzyme integration
------------------

Check [Riot-enzyme](https://www.npmjs.com/package/riot-enzyme) out.

Requirement
-----------

- JavaScript runtime, ES5 compatible at least and supports:
  - `Symbol` for snapshot testing.
- DOM Environment like real browsers or `jsdom` and supports:
  - `querySelectorAll` and `compareDocumentPosition` for finding(IE9 is dropped!).

TODO
----

- [x] Event simulated
- [x] Deep rendering
- [ ] Compiler options to set parsers
- [x] Implement update.
- [ ] To test the attributes of root opts
- [ ] Full-featured finding API.
- [x] More efficient API for multiple tags to compile once shared and use anywhere.
- [ ] Other testing utility.
- [x] Finding API on `querySelctorAll` similar to jQuery or Cheerio like Enzyme
- [ ] *To promote* results of find() if they are actually tag instances.
