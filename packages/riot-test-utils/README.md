Riot-test-utils
===============

This provides lightweight testing of `Riot` tags without any DOM environemnt such as browsers nor `js-dom`.

It is highly inspired by [`React-test-utils`](https://reactjs.org/docs/test-utils.html) [`Enzyme`](https://github.com/airbnb/enzyme), great testing utility for [`React`](https://reactjs.org/).

Features:

- *shallow-rendering*.
- Easy APIs similar to Enzyme.

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
assert(wrapper.html() === '<tag><p>Hello, world!</p></tag>');
```

Templating also works.

```js
var wrapper = shallow('<tag><p>{opts.greeting}</p></tag>', { greeting: 'Hello, world!' });

assert(wrapper.html() === '<tag><p>Hello, world!</p></tag>');
```

**WARNING**: Special sequence, such as each, if, show, hide, and virtual, works *LIMITED*.

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
assert(wrapper.html() === '<root><nested></nested></root>');
```

You can look `opts` as the attributes of nested tags.

For example:

```js
var wrapper = shallow('<root><nested data="Hello" /></root>');

assert(wrapper.html() === '<root><nested data="Hello"></nested></root>');
```

You can use `toJSON()` to use **[snapshot-testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html)**
to keep your tags.

With `jest` for example:

```js
it('should match snapshot', function () {
  var wrapper = shallow('<tag><h1>Example:</h1><p>Hello, world!</p></tag>');

  expect(wrapper.toJSON()).toMatchSnapshot();
});
```

Enzyme integration
------------------

Check [Riot-enzyme](https://www.npmjs.com/package/riot-enzyme) out.

Requirement
-----------

- JavaScript runtime, ES5 compatible, at least.

TODO
----

- [ ] Event simulated
- [ ] Deep rendering
- [ ] Compiler options to set parsers
- [ ] Implement update.
- [x] Support attributes if, each, show, and hide
- [ ] To test the attributes of root opts
- [ ] Support boolean attributes
- [ ] Support styles object expressions
- [ ] Implement CSS class shorthand
- [x] parent property
- [ ] inheritance in loop context
- [x] tags, limited in shallow context
- [ ] refs [LOW] -- hard to realize without DOM
- [ ] tags [LOW]
- [ ] Make script section working close to real DOM.
- [ ] Lifecycle methods.
- [ ] mixins [LOW]
- [ ] Full-featured finding API.
- [ ] More efficient API for multiple tags to compile once shared and use anywhere.
- [ ] Handle &lt;virtual&gt; tag. [LOW Priority]
- [ ] Handle yield. [LOW Priority]
- [ ] Mixin [LOW]
- [x] Helper API for snapshot testing
- [ ] Other testing utility.
- [ ] Exclude requirement of polyfill using `babel-runtime-transform`.
- [ ] Testing method for SSR with [`cheerio`](https://github.com/cheeriojs/cheerio) like one of `Enzyme`.

NOT-TODOS
---------

- [ ] Mount onto actual DOM
- [ ] Support style sections

Known Bugs
-----------

Template is incomplete, actually just interpolating expressions between "{}" area.

Nested tags:

- [ ] No parent of nested tags(shallow, static)
