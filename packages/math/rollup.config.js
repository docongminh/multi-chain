import { terser } from "rollup-plugin-terser";
//
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';
const UMD = {
	name: 'math',
	file: "./dist/index.umd.js",
	format: 'umd',
	sourcemap: true
};

const UMD_min = {
	name: 'math',
	file: "./dist/index.umd.min.js",
	format: 'umd',
	sourcemap: true,
	plugins: [terser({mangle: false, compress: false})]
};

const IIFE = { 
	file: "./dist/index.iife.js",
	format: 'iife',
	name: "math_iife",
	sourcemap: true
};
//
const IIFE_min = {
	file: 'dist/index.iife.min.js',
	format: 'iife',
	name: 'math_iife',
	sourcemap: true,
	plugins: [terser({mangle: false, compress: false})],
};
//
const ESM = { 
	file: "./dist/index.esm.js",
	format: 'es',
	sourcemap: true
}

const ESM_min = { 
	file: "./dist/index.esm.min.js",
	format: 'es',
	sourcemap: true,
	plugins: [terser({mangle: false, compress: false})],
}

export default [
	// browser-friendly build
	{
		input: 'src/index.ts',
		output:[UMD, UMD_min, IIFE, IIFE_min, ESM, ESM_min],
		plugins: [
			nodeResolve(),   // so Rollup can find `ms`
			commonjs(),  // so Rollup can convert `ms` to an ES module
			typescript({
				lib: ["es5", "es6", "dom"],
				target: "es5",
				outputToFilesystem: true
			}) // so Rollup can convert TypeScript to JavaScript
		]
	},
	// Node module build
	{
		input: 'src/index.ts',
		external: Object.keys(pkg['dependencies'] || []),
		plugins: [
			typescript({
				lib: ["es5", "es6", "dom"],
				target: "es5",
				outputToFilesystem: true
			}) // so Rollup can convert TypeScript to JavaScript
		],
		output: [
			{ file: pkg.main, format: 'cjs', sourcemap: true}
		]
	}
];