import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';

const IMPORT_CODE = `import { SpatialNavigationVirtualizedList } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { SpatialNavigationVirtualizedList } from 'react-native-cross-elements';

<SpatialNavigationVirtualizedList
  data={items}
  itemSize={72}
  numberOfRenderedItems={12}
  orientation="vertical"
  renderItem={({ item }) => <MenuItem item={item} />}
/>`;

export default function SpatialNavigationVirtualizedListPage() {
	return (
		<DocPage
			title="SpatialNavigationVirtualizedList"
			description="A spatial-navigation-aware virtualized list for large menus, catalogs, and TV layouts where rendering every focusable item would be expensive."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Preview',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} label="spatial-navigation-virtualized-list.tsx" height={180}>
							<View style={{ width: 280, gap: 6 }}>
								{['Item 01', 'Item 02', 'Item 03', '...virtualized'].map((item, index) => (
									<View key={item} style={{ padding: 10, borderRadius: 8, backgroundColor: index === 1 ? '#4f46e5' : '#18181b' }}>
										<Text style={{ color: '#ffffff' }}>{item}</Text>
									</View>
								))}
							</View>
						</ComponentPreview>
					),
				},
				{ title: 'Usage', content: <CodeBlock code={BASIC_EXAMPLE} language="tsx" /> },
				{ title: 'Tip', content: <Callout type="info">Provide stable item sizes so focus movement and scroll offsets stay predictable.</Callout> },
			]}
		/>
	);
}
