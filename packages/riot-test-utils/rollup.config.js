import typescript from 'rollup-plugin-typescript2';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: [
    'css-select',
    'lodash',
    'lodash/assign',
    'lodash/each',
    'lodash/keys',
    'lodash/map',
    'lodash/reduce',
    'lodash/unionWith',
    'riot',
    'riot-shallowize',
    'simulate-event',
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "es2015",
          moduleResolution: "node",
        },
      },
    }),
    uglify(),
  ],
};
