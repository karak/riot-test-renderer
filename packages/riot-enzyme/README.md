Riot-enzyme
===========

Riot-enzyme is a powerful testing utility to test tags of [Riot](http://riotjs.com/).

Shallow-rendering is provided by [`Riot-shallowize`](https://www.npmjs.com/package/riot-shallowize) including the limitation about transclusions.

It is **under development**, and now virtually following `Riot-test-util`, that is strongly recommended.

Features
--------

- Shallow rendering
- Finding with CSS selectors
- Snapshot testing

It is a thin wrapper of [Enzyme](http://airbnb.io/enzyme/). Please note shallow-rendering needs DOM.

Installation
-------

```sh
npm install --save-dev riot-enzyme
```

Usage
-----

Load as:

```js
// es5
var shallow = require('react').shallow;

// es6
import { shallow } from 'riot-enzyme';
```

Shallow rendering as:

```js
var tag = '<tag><p>{opts.data}</p></tag>';

var wrapper = shallow(tag, { data: 'Hello, world!'});
```

Test with jest for example:

```js
// Opts are passed
expect(wrapper.opts()).toEqual({data: 'Hello, world!'});

// Only one <p> inside <tag>, which contains the text.
expect(wrapper.find('p').text()).toBe('Hello, world!');
```

And test snapshot:

```js
expect(wrapper.toJson())).toMatchSnapshot();
```

WARNING: Currently, `toJson()` emits all the attributes as-is, including members of `opts` and `data-is`.

Specify a name for multiple tags as:

```js
var tags = `
<inner>
  <p>{opts.data}</p>
</inner>
<outer>
  <inner data={opts.innerData} />
</outer>
`;

var wrapper = shallow(tags, 'outer', { innerData: 'Hello, world'});
```

`shallow()` constructs *shallow* tree "&lt;outer&gt;&lt;inner data=&quot;Hello, world&quot;&gt;&lt;/inner&gt;&lt;/outer&gt;" rather than "&lt;outer&gt;&lt;inner&gt;&lt;p&gt;Hello, world&lt;/p&gt;&lt;/inner&gt;&lt;/outer&gt;",
keeping your tags highly independent and requiring *single* root tag definition in most cases.
