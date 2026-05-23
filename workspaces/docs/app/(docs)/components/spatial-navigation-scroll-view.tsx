import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';

const IMPORT_CODE = `import { SpatialNavigationScrollView } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { SpatialNavigationScrollView } from 'react-native-cross-elements';

<SpatialNavigationScrollView>
  <SpatialNavigationView direction="vertical">
    {items.map((item) => (
      <SpatialNavigationFocusableView key={item.id}>
        {({ isFocused }) => <Row focused={isFocused}>{item.title}</Row>}
      </SpatialNavigationFocusableView>
    ))}
  </SpatialNavigationView>
</SpatialNavigationScrollView>`;

export default function SpatialNavigationScrollViewPage() {
	return (
		<DocPage
			title="SpatialNavigationScrollView"
			description="A scroll container that cooperates with spatial focus movement so remote, keyboard, and pointer users can keep focused items visible."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Preview',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} label="spatial-navigation-scroll-view.tsx" height={170}>
							<View style={{ gap: 8, width: 260 }}>
								{['Focused rows stay visible', 'Works with vertical menus', 'Useful for TV surfaces'].map((item) => (
									<View key={item} style={{ padding: 10, borderRadius: 8, backgroundColor: '#18181b' }}>
										<Text style={{ color: '#a1a1aa' }}>{item}</Text>
									</View>
								))}
							</View>
						</ComponentPreview>
					),
				},
				{ title: 'Usage', content: <CodeBlock code={BASIC_EXAMPLE} language="tsx" /> },
				{ title: 'Tip', content: <Callout type="tip">Wrap long spatial menus in SpatialNavigationScrollView instead of a plain ScrollView.</Callout> },
			]}
		/>
	);
}
