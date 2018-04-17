import typescript from 'rollup-plugin-typescript2';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

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
    nodeResolve(),
    commonjs(),
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
