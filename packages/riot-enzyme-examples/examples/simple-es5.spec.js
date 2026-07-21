var shallow = require('riot-enzyme').shallow;

var tag = '<tag><p>{opts.data}</p></tag>';

var wrapper;
beforeEach(function() {
  wrapper = shallow(tag, { data: 'Hello, world!' });
});

it('should have json form', function() {
  expect(wrapper.toJson()).toMatchSnapshot();
});

it('should have opts', function() {
  // Opts are passed ("dataIs" is added by riot itself from the "data-is" attribute)
  expect(wrapper.opts()).toEqual({ data: 'Hello, world!', dataIs: 'tag' });
});

it('should have <p> inside', function() {
  // Only one <p> inside <tag>, which contains the text.
  expect(wrapper.find('p').text()).toBe('Hello, world!');
});
