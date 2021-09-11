import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const input = 'src/index.js';
const external = Object.keys(pkg.peerDependencies || {});
const plugins = [];

export default [
  //CommonJS
  {
    input,
    output: { file: 'lib/json-enhancer.js', format: 'cjs', indent: false },
    external,
    plugins,
  },

  //ESM
  {
    input,
    output: { file: 'esm/json-enhancer.js', format: 'esm', indent: false },
    external,
    plugins,
  },

  //UMD
  {
    input,
    output: {
      file: 'dist/json-enhancer.js',
      format: 'umd',
      name: 'json-enhancer',
      indent: false
    },
    external,
    plugins,
  },

  //UMD Production
  {
    input,
    output: {
      file: 'dist/json-enhancer.min.js',
      format: 'umd',
      name: 'json-enhancer',
      indent: false
    },
    external,
    plugins: [
      terser(
        {
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        }
      )
    ],
  },
]