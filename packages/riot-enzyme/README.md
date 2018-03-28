Riot-enzyme
===========

Riot-enzyme is a powerful testing utility to test tags of [Riot](http://riotjs.com/).


It is **under development**.

Soory, this package is working progress and doe **NOT WORK** from JavaScript outside the package.

Features
--------

- DOM free, as well as any browser environment
- Shallow rendering
- Finding with CSS selectors
- Snapshot testing

It is a thin wrapper of [Enzyme](http://airbnb.io/enzyme/).


Install
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
var tag = `
<tag>
  <p>{opts.data}</p>
</tag>
`;

var wrapper = shallow(tag, { data: 'Hello, world'});
```

`shallow()` constructs *shallow* tree "&lt;outer&gt;&lt;inner data=&quot;Hello, world&quot;&gt;&lt;/inner&gt;&lt;/outer&gt;" rather than "&lt;outer&gt;&lt;p&gt;Hello, world&lt;/p&gt;&lt;/outer&gt;", keeping your tags highly independent.

WARNING: `{}` expressions have many bugs and limits.

Test with jest for example:

```js
// Opts are passed
expect(wrapper.opts()).toEqual({data: 'Hello, world'});

// Only one <p> inside <tag>, which contains the text.
expect(wrapper.find('p').text()).toBe('Hello, world!');
```

And test snapshot:

```js
expect(wrapper.toJson())).toMatchSnapshot();
```

WARNING: Currently, `toJson()` emits all the attributes including event handlers.

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

