import pkg from '../package.json';
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";

let isProd = process.env.NODE_ENV === 'production';

export default [
	{
		input: 'lib/template.js',
		output: [
			{ file: pkg.browser, format: 'umd', name: 'Template', exports: 'named' },
			{ file: pkg.main, format: 'cjs', exports: 'named' },
			{ file: pkg.module, format: 'es', exports: 'named' },
		],
		plugins: [
			resolve(),
			babel({
				exclude: 'node_modules/**',
				runtimeHelpers: true,
				presets: [["@babel/preset-env"]],
				plugins: [['@babel/transform-runtime', { useESModules: true }]],
				babelrc: false
			}),
			commonjs(),
			isProd && terser()
		]
	}
];