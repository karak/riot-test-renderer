var baseConfig = require('../../jest.config');

module.exports = Object.assign({}, baseConfig, {
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/__tests__\/tags/",
  ],
});

