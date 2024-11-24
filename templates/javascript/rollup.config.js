import {babel} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
	input: 'src/javascript/main.javascript',
	output: {
		file: 'dist/javascript/bundle.javascript',
		format: 'iife',
		sourcemap: true
	},
	plugins: [
		nodeResolve(),
		commonjs(),
		babel({
			babelHelpers: 'bundled',
			presets: ['@babel/preset-env']
		})
	]
};
