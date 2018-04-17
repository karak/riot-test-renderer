import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: [
    'enzyme',
    'enzyme-adapter-utils',
    'lodash',
    'lodash/isString',
    'lodash/assign',
    'lodash/map',
    'riot',
    'riot-test-utils',
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
