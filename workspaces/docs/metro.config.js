const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Monorepo support: watch the whole repo and resolve node_modules from both
config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, 'node_modules'),
	path.resolve(monorepoRoot, 'node_modules'),
];

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName === 'react') {
		return {
			type: 'sourceFile',
			filePath: path.resolve(monorepoRoot, 'node_modules/react/index.js'),
		};
	}

	if (moduleName === 'react/jsx-runtime') {
		return {
			type: 'sourceFile',
			filePath: path.resolve(monorepoRoot, 'node_modules/react/jsx-runtime.js'),
		};
	}

	if (moduleName === 'react/jsx-dev-runtime') {
		return {
			type: 'sourceFile',
			filePath: path.resolve(monorepoRoot, 'node_modules/react/jsx-dev-runtime.js'),
		};
	}

	if (moduleName === 'pretty-format') {
		return {
			type: 'sourceFile',
			filePath: path.resolve(monorepoRoot, 'node_modules/pretty-format/build/index.js'),
		};
	}

	return defaultResolveRequest
		? defaultResolveRequest(context, moduleName, platform)
		: context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
