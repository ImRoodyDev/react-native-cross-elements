import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../components/DocPage';
import { CodeBlock } from '../../components/CodeBlock';

const INSTALL_NPM = `npm install react-native-cross-elements`;
const INSTALL_YARN = `yarn add react-native-cross-elements`;

const BABEL_CONFIG = `// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // NativeWind (if used) — must come before reanimated
      'nativewind/babel',
      // Reanimated — must be last plugin
      'react-native-reanimated/plugin',
    ],
  };
};`;

const IOS_BUILD = `# Install CocoaPods dependencies
npx pod-install

# Then run your app
npx expo run:ios`;

const ANDROID_BUILD = `npx expo run:android`;

const PROVIDER_SETUP = `// App.tsx
import React from 'react';
import { PortalHost } from 'react-native-cross-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Optional: mount PortalHost for overlays/dropdowns */}
        <PortalHost />
        {children}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}`;

export default function InstallationPage() {
	return (
		<DocPage
			title="Installation"
			description="Get react-native-cross-elements installed and configured in your React Native project."
			sections={[
				{
					title: '1. Install the package',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm mb-2">With npm:</Text>
							<CodeBlock code={INSTALL_NPM} language="bash" />
							<Text className="text-zinc-400 text-sm mt-2 mb-2">Or with yarn:</Text>
							<CodeBlock code={INSTALL_YARN} language="bash" />
						</View>
					),
				},
				{
					title: '2. Install peer dependencies',
					content: (
						<View className="gap-3">
							<Callout type="warning">
								These peer dependencies are required. Install them if you haven't already.
							</Callout>
							<CodeBlock code={`npm install react-native-reanimated react-native-safe-area-context`} language="bash" />
							<View className="mt-3">
								<Text className="text-zinc-300 text-sm leading-6">
									<Text className="text-amber-300 font-mono">react-native-reanimated</Text>
									{'  ≥ 3.0.0\n'}
									<Text className="text-amber-300 font-mono">react-native-safe-area-context</Text>
									{'  ≥ 5.0.0\n'}
								</Text>
							</View>
						</View>
					),
				},
				{
					title: '3. Configure Reanimated',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								The <Text className="text-amber-300 font-mono">react-native-reanimated/plugin</Text> Babel plugin must
								be added as the <Text className="text-white font-medium">last plugin</Text> in your babel.config.js.
							</Text>
							<CodeBlock code={BABEL_CONFIG} language="js" />
							<Callout type="info">
								If you're using NativeWind, add its babel plugin before the Reanimated plugin.
							</Callout>
						</View>
					),
				},
				{
					title: '4. Rebuild native app',
					content: (
						<View className="gap-4">
							<Text className="text-zinc-400 text-sm leading-6">
								After modifying babel.config.js, you must fully rebuild the native app — a regular reload won't pick up
								Worklets changes.
							</Text>
							<View>
								<Text className="text-zinc-300 text-sm font-semibold mb-2">iOS</Text>
								<CodeBlock code={IOS_BUILD} language="bash" />
							</View>
							<View>
								<Text className="text-zinc-300 text-sm font-semibold mb-2">Android</Text>
								<CodeBlock code={ANDROID_BUILD} language="bash" />
							</View>
						</View>
					),
				},
				{
					title: '5. Wrap your app',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Add <Text className="text-amber-300 font-mono">GestureHandlerRootView</Text>,{' '}
								<Text className="text-amber-300 font-mono">SafeAreaProvider</Text>, and optionally{' '}
								<Text className="text-amber-300 font-mono">PortalHost</Text> at the root of your app.
							</Text>
							<CodeBlock code={PROVIDER_SETUP} language="tsx" />
						</View>
					),
				},
			]}
		/>
	);
}
