const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

module.exports = (() => {
	const projectRoot = __dirname;
	const monorepoRoot = path.resolve(projectRoot, '../..');
	const packageRoot = path.resolve(monorepoRoot, 'workspaces/package');

	const config = getDefaultConfig(__dirname);
	const { transformer, resolver } = config;

	// Monorepo support: keep Metro focused on the app and hoisted dependencies.
	// Watching the repository root makes web export crawl server/generated files.
	config.watchFolders = [
		packageRoot,
		path.resolve(monorepoRoot, 'node_modules'),
	];
	config.resolver.nodeModulesPaths = [
		path.resolve(projectRoot, 'node_modules'),
		path.resolve(monorepoRoot, 'node_modules'),
	];

	const defaultResolveRequest = config.resolver.resolveRequest;
	config.resolver.resolveRequest = (context, moduleName, platform) => {
		if (moduleName === 'react-native-cross-elements') {
			return {
				type: 'sourceFile',
				filePath: path.resolve(packageRoot, 'src/index.ts'),
			};
		}

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

	return withNativeWind(config, { input: './global.css' });
})();
