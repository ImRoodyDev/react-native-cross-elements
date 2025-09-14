/** @type {import('@babel/core').TransformOptions} */
module.exports = {
	presets: [
		[
			'@babel/preset-env', {targets: {node: 'current',},},
		],
		'@babel/preset-typescript',
		[
			'@babel/preset-react',
			{
				runtime: 'automatic',
			},
		],
		'module:@react-native/babel-preset',
	],
	plugins: [
		['react-native-worklets/plugin', {disableInlineStylesWarning: true}],
		'@babel/plugin-proposal-class-properties',
	],
};

