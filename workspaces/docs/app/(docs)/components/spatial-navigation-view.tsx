import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';

const IMPORT_CODE = `import { SpatialNavigationView } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import {
  SpatialNavigationRoot,
  SpatialNavigationView,
  SpatialNavigationFocusableView,
} from 'react-native-cross-elements';

<SpatialNavigationRoot>
  <SpatialNavigationView direction="horizontal">
    {items.map((item) => (
      <SpatialNavigationFocusableView key={item} onSelect={() => console.log(item)}>
        {({ isFocused }) => <Card focused={isFocused}>{item}</Card>}
      </SpatialNavigationFocusableView>
    ))}
  </SpatialNavigationView>
</SpatialNavigationRoot>`;

function Demo() {
	const [selected, setSelected] = useState('None');
	return (
		<View style={{ gap: 12, alignItems: 'center' }}>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				{['A', 'B', 'C'].map((item) => (
					<Pressable
						key={item}
						onPress={() => setSelected(item)}
						style={({ hovered, pressed }) => ({
							paddingHorizontal: 18,
							paddingVertical: 12,
							borderRadius: 10,
							backgroundColor: hovered || pressed ? '#4f46e5' : '#18181b',
							borderWidth: 1,
							borderColor: hovered || pressed ? '#818cf8' : '#27272a',
						})}
					>
						<Text style={{ color: '#ffffff', fontWeight: '700' }}>{item}</Text>
					</Pressable>
				))}
			</View>
			<Text style={{ color: '#52525b', fontSize: 13 }}>Selected: {selected}</Text>
		</View>
	);
}

export default function SpatialNavigationViewPage() {
	return (
		<DocPage
			title="SpatialNavigationView"
			description="A directional container that groups focusable children and tells the spatial navigator how focus should move between them."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{ title: 'Preview', content: <ComponentPreview code={BASIC_EXAMPLE} label="spatial-navigation-view.tsx" height={160}><Demo /></ComponentPreview> },
				{ title: 'Usage', content: <CodeBlock code={BASIC_EXAMPLE} language="tsx" /> },
				{ title: 'Direction', content: <Callout type="info">Use direction="horizontal" for rows and direction="vertical" for columns.</Callout> },
			]}
		/>
	);
}
