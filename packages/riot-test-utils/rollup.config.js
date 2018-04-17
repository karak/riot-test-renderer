import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: [
    'lodash',
    'lodash/each',
    'riot',
    'riot-shallowize',
    'simulate-event',
  ],
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "es2015",
          moduleResolution: "node",
        },
      },
    }),
  ],
};
