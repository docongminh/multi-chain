import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

import pkg from './package.json';
// console.log("dep: ", pkg['dependencies'])
export default {
  external: Object.keys(pkg['dependencies'] || []),
  input: './src/index.ts',
  plugins: [
    typescript(),
    resolve({
      mainFields: [ "browser", "module", "main" ],
      preferBuiltins: false
  }),
    commonjs()
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: 'esm',
      file: pkg.module,
      sourcemap: true
    },
    // CommonJS (for Node) build.
    {
      format: 'cjs',
      file: pkg.main,
      sourcemap: true
    },
    // browser-friendly UMD build
    // {
    //   format: 'umd',
    //   file: pkg.browser,
    //   name: "math"
    // },
  ]
}