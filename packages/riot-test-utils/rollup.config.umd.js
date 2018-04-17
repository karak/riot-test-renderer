import baseConfig from './rollup.config.js';

export default Object.assign(
  {},
  baseConfig,
  {
    external: [
      'riot',
      // "riot-shallowize", "simulate-event" and "lodash/each" are bundled
    ],
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'RiotTestUtils',
      globals: {
        'riot': 'riot',
      },
    }
  },
);
