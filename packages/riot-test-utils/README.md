Riot-test-utils
===============

This provides lightweight testing of `Riot` tags.

It is highly inspired by [`React-test-utils`](https://reactjs.org/docs/test-utils.html) [`Enzyme`](https://github.com/airbnb/enzyme), great testing utility for [`React`](https://reactjs.org/).

Shallow-rendering is provided by [`Riot-shallowize`](https://www.npmjs.com/package/riot-shallowize) including the limitation about transclusions.

Features:

- *shallow-rendering*.

This library is **under development** and for my personal use. Any contributions are welcome!

Usage
-----

Install by `npm`:

```bash
npm install -D riot-test-utils
```

Create wrapper for single tag source as:

```js
var shallow = require('riot-test-utils').shallow;

var wrapper = shallow('<tag><p>Hello, world!</p></tag>');
```

and look outerHTML:

```js
assert(wrapper.html() === '<tag data-is="tag"><p>Hello, world!</p></tag>');
```

Templating also works.

```js
var wrapper = shallow('<tag><p>{opts.greeting}</p></tag>', { greeting: 'Hello, world!' });

assert(wrapper.html() === '<tag data-is="tag"><p>Hello, world!</p></tag>');
```

Specify the name to test when you have multiple tags:

```js
var wrapper = shallow(
  [
    '<nested><p>Hello, world!</p></nested>',
    '<root><nested /></root>'
  ].join('\n'),
  'root'
);
```

This is *shallow* rendered as:

```js
assert(wrapper.html() === '<root data-is="root"><nested data-is="nested"></nested></root>');
```

You can look `opts` as the attributes of nested tags.

For example:

```js
var wrapper = shallow('<root><nested data="Hello" /></root>');

assert(wrapper.html() === '<root><nested data="Hello"></nested></root>');
```
Of course, you can mount by name being registered.

```js
var wrapper = shallow('tag', { greeting: 'Hellow, world' });
```

DOM testing
-----------

You can get DOM Element by `root()`.

Then, you can inspect by DOM API or some utility like jQuery.

```js
var wrapper = shallow('tag', { greeting: 'Hellow, world' });

assert(wrapper.root.querySelector('p').textContent === 'Hellow, world' );

assert($(wrapper.root).find('p').text() === 'Hello, world');
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

Public API
----------

### Module
#### shallow(tagName, [opts])
#### shallow(singleTagSource, [opts])
#### shallow(multipleTagSource, tagName, [opts])

Mount with out shallow renderer.
#### Simulate

It returns `ShallowWrapper`.

### ShallowWrapper

#### instance()

It returns `TagInstance` of root.

#### root()

It is equivalent to `instance().root`.

#### opts([name])

Get opts, whole object if name is not specified, or one value of opts otherwise

#### refs()

It is equivalent to `instance().refs`.

#### unmount()

Unmount the tag.

It is equivalent to `instance().unmount()`.

#### html()

Get outer HTML by string.

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

**NOTICE**: This would prove its merits if `find()` API is implemented.

Until then, use low-level API `Simulate`. For example:

```js
var TestUtils = require('riot-test-utils')

var wrapper = TestUtils.shallow('command-bar')

TestUtils.Simulate.click(wrapper.root().querySelector('#link'))
```

Enzyme integration
------------------

Check [Riot-enzyme](https://www.npmjs.com/package/riot-enzyme) out.

Requirement
-----------

- JavaScript runtime, ES5 compatible, at least.

TODO
----

- [x] Event simulated
- [ ] Deep rendering
- [ ] Compiler options to set parsers
- [ ] Implement update.
- [ ] To test the attributes of root opts
- [ ] Full-featured finding API.
- [ ] More efficient API for multiple tags to compile once shared and use anywhere.
- [ ] Other testing utility.
- [ ] Testing method with `jquery` integration
- [ ] Testing method for SSR with [`cheerio`](https://github.com/cheeriojs/cheerio) like one of `Enzyme`.
