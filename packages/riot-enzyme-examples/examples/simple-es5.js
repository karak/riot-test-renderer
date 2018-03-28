var assert = require('assert');
var shallow = require("riot-enzyme").shallow;

var tag = `
<tag>
  <p>{opts.data}</p>
</tag>
`;

var wrapper = shallow(tag, { data: 'Hello, world'});

console.log(wrapper.toJson());

// Opts are passed
assert.deepEqual(wrapper.opts(), {data: 'Hello, world'});

// Only one <p> inside <tag>, which contains the text.
assert.deepEqual(wrapper.find('p').text(), 'Hello, world!');
