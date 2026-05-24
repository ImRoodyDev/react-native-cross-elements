import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';

const IMPORT_CODE = `import { SpatialNavigationDeviceTypeProvider } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import {
  SpatialNavigationDeviceTypeProvider,
  SpatialNavigationRoot,
} from 'react-native-cross-elements';

export default function App() {
  return (
    <SpatialNavigationDeviceTypeProvider>
      <SpatialNavigationRoot>
        <AppRoutes />
      </SpatialNavigationRoot>
    </SpatialNavigationDeviceTypeProvider>
  );
}`;

export default function SpatialNavigationDeviceTypeProviderPage() {
	return (
		<DocPage
			title="SpatialNavigationDeviceTypeProvider"
			description="Detects whether the user is interacting with pointer, keyboard, touch, or remote input so spatial navigation can adapt focus behavior."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Preview',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} label="device-type-provider.tsx" height={150}>
							<View style={{ alignItems: 'center', gap: 8 }}>
								<Text style={{ color: '#e4e4e7', fontWeight: '700' }}>Input mode aware navigation</Text>
								<Text style={{ color: '#52525b', fontSize: 13, textAlign: 'center' }}>
									Wrap it above SpatialNavigationRoot.
								</Text>
							</View>
						</ComponentPreview>
					),
				},
				{ title: 'Usage', content: <CodeBlock code={BASIC_EXAMPLE} language="tsx" /> },
				{
					title: 'Tip',
					content: (
						<Callout type="info">
							Use this provider once near the root of apps that support both pointer and remote style navigation.
						</Callout>
					),
				},
			]}
		/>
	);
}
