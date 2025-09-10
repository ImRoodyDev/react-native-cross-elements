/** @type {import('@babel/core').TransformOptions} */
module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					node: 'current',
				},
			},
		],
		'@babel/preset-typescript',
		'module:@react-native/babel-preset',
	],
	plugins: [
		['react-native-worklets/plugin', {disableInlineStylesWarning: true}],
	],
};

// module.exports = {
//
// 	presets: [
// 		[
// 			'@babel/preset-env',
// 			{
// 				targets: {
// 					node: 'current',
// 				},
// 			},
// 		],
// 		// '@babel/preset-react',
// 		'@babel/preset-typescript',
// 		"module:@react-native/babel-preset"
// 	],
// 	env: {
// 		cjs: {
// 			presets: [
// 				["@babel/preset-env", {"modules": "commonjs", "loose": true}]
// 			]
// 		},
// 		esm: {
// 			presets: [
// 				["@babel/preset-env", {"modules": false, "loose": true}]
// 			]
// 		},
// 		production: {
// 			plugins: [
// 				['transform-remove-console', {exclude: ['error', 'warn']}]
// 			]
// 		}
// 	},
// 	plugins: [
// 		// Add this plugin to handle className props
// 		[
// 			'babel-plugin-transform-react-jsx',
// 			{
// 				runtime: 'automatic',
// 				importSource: 'react-native',
// 			},
// 		],
// 		['react-native-worklets/plugin', {disableInlineStylesWarning: true}],
// 	]
// };
