module.exports = {
  "transform": {
    "^.+\\.tsx?$": ["ts-jest", {}]
  },
  "testEnvironment": "jsdom",
  "testEnvironmentOptions": {
    "customExportConditions": [""]
  },
  "setupFiles": [require.resolve('./jest.setup.js')],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/__tests__\/helpers/"
  ],
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}
