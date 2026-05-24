import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';

const IMPORT_CODE = `import { SpatialNavigationVirtualizedGrid } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { SpatialNavigationVirtualizedGrid } from 'react-native-cross-elements';

<SpatialNavigationVirtualizedGrid
  data={movies}
  itemSize={160}
  numberOfColumns={4}
  numberOfRenderedItems={24}
  renderItem={({ item }) => <PosterCard movie={item} />}
/>`;

export default function SpatialNavigationVirtualizedGridPage() {
	return (
		<DocPage
			title="SpatialNavigationVirtualizedGrid"
			description="A virtualized spatial grid for large poster walls, catalogs, dashboards, and TV surfaces."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Preview',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} label="spatial-navigation-virtualized-grid.tsx" height={210}>
							<View style={{ width: 280, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
								{Array.from({ length: 6 }).map((_, index) => (
									<View key={index} style={{ width: 84, height: 62, borderRadius: 8, backgroundColor: index === 2 ? '#6366f1' : '#18181b', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={{ color: '#ffffff', fontWeight: '700' }}>{index + 1}</Text>
									</View>
								))}
							</View>
						</ComponentPreview>
					),
				},
				{ title: 'Usage', content: <CodeBlock code={BASIC_EXAMPLE} language="tsx" /> },
				{ title: 'Tip', content: <Callout type="info">Use virtualized grids when a focusable catalog is too large to render all at once.</Callout> },
			]}
		/>
	);
}
