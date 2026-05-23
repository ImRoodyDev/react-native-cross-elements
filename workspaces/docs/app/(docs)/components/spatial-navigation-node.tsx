import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';

const IMPORT_CODE = `import { SpatialNavigationNode, type SpatialNavigationNodeRef } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `const nodeRef = React.useRef<SpatialNavigationNodeRef>(null);

<SpatialNavigationNode
  ref={nodeRef}
  onFocus={() => console.log('focused')}
  onBlur={() => console.log('blurred')}
  onSelect={() => console.log('selected')}
>
  {({ isFocused }) => <Card focused={isFocused} />}
</SpatialNavigationNode>;

nodeRef.current?.focus();`;

function Demo() {
	const [state, setState] = useState('Idle');
	return (
		<View style={{ gap: 12, alignItems: 'center' }}>
			<Pressable
				onFocus={() => setState('Focused')}
				onBlur={() => setState('Blurred')}
				onPress={() => setState('Selected')}
				style={({ hovered, pressed }) => ({
					paddingHorizontal: 20,
					paddingVertical: 12,
					borderRadius: 10,
					backgroundColor: hovered || pressed ? '#16a34a' : '#18181b',
					borderWidth: 1,
					borderColor: hovered || pressed ? '#4ade80' : '#27272a',
				})}
			>
				<Text style={{ color: '#ffffff', fontWeight: '700' }}>Focusable node</Text>
			</Pressable>
			<Text style={{ color: '#52525b', fontSize: 13 }}>State: {state}</Text>
		</View>
	);
}

export default function SpatialNavigationNodePage() {
	return (
		<DocPage
			title="SpatialNavigationNode"
			description="The low-level focus registration primitive. Use it when you need direct control over focus lifecycle, select events, and imperative focus refs."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{ title: 'Preview', content: <ComponentPreview code={BASIC_EXAMPLE} label="spatial-navigation-node.tsx" height={160}><Demo /></ComponentPreview> },
				{ title: 'Usage', content: <CodeBlock code={BASIC_EXAMPLE} language="tsx" /> },
				{ title: 'Tip', content: <Callout type="tip">Most UIs can use SpatialNavigationFocusableView. Use SpatialNavigationNode for custom primitives.</Callout> },
			]}
		/>
	);
}
