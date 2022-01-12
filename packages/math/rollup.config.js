import { terser } from "rollup-plugin-terser";
//
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: 'math',
			file: pkg.browser,
			format: 'umd',
			sourcemap: true
		},
		plugins: [
			nodeResolve(),   // so Rollup can find `ms`
			commonjs(),  // so Rollup can convert `ms` to an ES module
			typescript({
				lib: ["es5", "es6", "dom"],
				target: "es5"
			}) // so Rollup can convert TypeScript to JavaScript
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'src/index.ts',
		external: Object.keys(pkg['dependencies'] || []),
		plugins: [
      		terser({module: true}),
			nodeResolve(),
			typescript({
				lib: ["es5", "es6", "dom"],
				target: "es5"
			}) // so Rollup can convert TypeScript to JavaScript
		],
		output: [
			{ file: pkg.main, format: 'cjs', sourcemap: true},
			{ file: pkg.module, format: 'es', sourcemap: true}
		]
	}
];