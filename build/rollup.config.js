import pkg from "../package.json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const isProd = process.env.NODE_ENV === "production";

export default [
	{
		input: "src/template.ts",
		output: [
			{ file: pkg.browser, format: "umd", name: "Template", exports: "named" },
			{ file: pkg.main, format: "cjs", exports: "named" },
			{ file: pkg.module, format: "es", exports: "named" },
		],
		plugins: [
			typescript({ lib: ["es5", "es6", "dom"], target: "es5" }),
			resolve({ jsnext: true }),
			commonjs(),
			isProd && terser()
		]
	}
];