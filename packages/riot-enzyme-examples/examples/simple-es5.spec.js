var shallow = require('riot-enzyme').shallow;

var tag = `
<tag>
  <p>{opts.data}</p>
</tag>
`;

var wrapper;
beforeEach(function () {
   wrapper = shallow(tag, { data: 'Hello, world'});
});

it('should have json form', function () {
  expect(wrapper.toJson()).toEqual({
    name: 'tag',
    opts: {},
    children: [
      {
        name: 'p',
        opts: {},
        children: [
          'Hello, world!'
        ]
      }
    ]
  });
});

it('should have opts', function () {
  // Opts are passed
  expect(wrapper.opts()).toBe({data: 'Hello, world'});
});

it('should have <p> inside', function () {
  // Only one <p> inside <tag>, which contains the text.
  expect(wrapper.find('p').text()).toBe('Hello, world!');
});
