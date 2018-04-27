# Riot-test-utils-jquery

An official jQuery extension of [`riot-test-utils`](https://www.npmjs.com/package/riot-test-utils).

Currently, this extension is a little experimental.

## Installation

Install via NPM

```sh
npm i riot-test-utils-jquery -D
```

## Usage

Require once somewhere in your code:

```js
require('riot-test-utils-jquery');
var mount = require('riot-test-utils');
```

Then, its extension methods are available as ordinaly ones of wrappers.

```js
var wrapper = mount('my-form');
assert(wrapper.find('input[type="submit"]').is(':disabled')); // jQuery.is(selector)
```

## API

You can call some APIs of jQuery as assertion helpers from `RiotWrapper` and`WeakWrapper`.

The list of them is below:

- is
- has
- hasClass
- attr
- css
- data
- prop
- val

and an escape hatch `$()` to get jQuery object itself.

Note all of the *mutaters* like `prop('disabled', true)` returns the wrapper itself.

