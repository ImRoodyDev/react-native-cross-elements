import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import {
  SpatialNavigationFocusableView,
  SpatialNavigationView,
  SpatialNavigationNode,
  DefaultFocus,
  type SpatialNavigationNodeRef,
} from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { Text } from 'react-native';
import {
  SpatialNavigationRoot,
  SpatialNavigationView,
  SpatialNavigationFocusableView,
  SpatialNavigationDeviceTypeProvider,
} from 'react-native-cross-elements';

export default function Example() {
  return (
    <SpatialNavigationDeviceTypeProvider>
      <SpatialNavigationRoot>
        {/* Row of focusable cards */}
        <SpatialNavigationView direction="horizontal">
          {['Card A', 'Card B', 'Card C'].map((label) => (
            <SpatialNavigationFocusableView
              key={label}
              onSelect={() => console.log('selected', label)}
              style={{ margin: 8, padding: 20, borderRadius: 12 }}
            >
              {({ isFocused }) => (
                <Text
                  style={{
                    color: isFocused ? '#fff' : '#a1a1aa',
                    backgroundColor: isFocused ? '#6366f1' : '#18181b',
                    padding: 16,
                    borderRadius: 10,
                  }}
                >
                  {label}
                </Text>
              )}
            </SpatialNavigationFocusableView>
          ))}
        </SpatialNavigationView>
      </SpatialNavigationRoot>
    </SpatialNavigationDeviceTypeProvider>
  );
}`;

const DEFAULT_FOCUS_EXAMPLE = `import { DefaultFocus, SpatialNavigationFocusableView } from 'react-native-cross-elements';

// Mark a subtree as initially focused when the parent activates
<DefaultFocus>
  <SpatialNavigationFocusableView onSelect={() => {}}>
    {({ isFocused }) => <MyCard focused={isFocused} />}
  </SpatialNavigationFocusableView>
</DefaultFocus>`;

const REF_EXAMPLE = `import { SpatialNavigationNode, type SpatialNavigationNodeRef } from 'react-native-cross-elements';

const nodeRef = React.useRef<SpatialNavigationNodeRef>(null);

<SpatialNavigationNode ref={nodeRef} onSelect={() => {}}>
  <MyItem />
</SpatialNavigationNode>

// Focus programmatically
nodeRef.current?.focus();`;

const FOCUSABLE_VIEW_PROPS: PropRow[] = [
	{
		name: 'children',
		type: 'ReactNode | (state: { isFocused }) => ReactNode',
		required: true,
		description: 'Content or render-prop receiving focus state.',
	},
	{ name: 'onFocus', type: '() => void', description: 'Called when this node receives focus.' },
	{ name: 'onBlur', type: '() => void', description: 'Called when this node loses focus.' },
	{ name: 'onSelect', type: '() => void', description: 'Called when the select action fires on this node.' },
	{ name: 'onLongSelect', type: '() => void', description: 'Called on long press / long select.' },
	{ name: 'style', type: 'ViewStyle', description: 'Container style.' },
	{ name: 'viewProps', type: 'ViewProps', description: 'Additional props forwarded to the inner View.' },
];

const NODE_PROPS: PropRow[] = [
	{ name: 'onFocus', type: '() => void', description: 'Called on focus.' },
	{ name: 'onBlur', type: '() => void', description: 'Called on blur.' },
	{ name: 'onSelect', type: '() => void', description: 'Called on select action.' },
	{ name: 'onActive', type: '() => void', description: 'Called when the node becomes active.' },
	{ name: 'onInactive', type: '() => void', description: 'Called when the node becomes inactive.' },
	{ name: 'orientation', type: 'NodeOrientation', description: 'Layout orientation for child focus propagation.' },
	{ name: 'isFocusable', type: 'boolean', default: 'true', description: 'Whether this node can receive focus.' },
	{ name: 'children', type: 'ReactNode', required: true, description: 'Navigable children.' },
];

function FocusableViewDemo() {
	const [focused, setFocused] = useState<number | null>(null);
	return (
		<View style={{ gap: 12, alignItems: 'center' }}>
			<Text style={{ color: '#52525b', fontSize: 12 }}>Tab or click to focus</Text>
			<View style={{ flexDirection: 'row', gap: 8 }}>
				{['Card A', 'Card B', 'Card C'].map((label, i) => (
					<Pressable
						key={i}
						onFocus={() => setFocused(i)}
						onBlur={() => setFocused(null)}
						onPress={() => setFocused(i)}
						style={{
							padding: 16,
							borderRadius: 12,
							backgroundColor: focused === i ? '#6366f1' : '#1c1c1f',
							borderWidth: 2,
							borderColor: focused === i ? '#818cf8' : '#27272a',
						}}
					>
						<Text style={{ color: focused === i ? '#ffffff' : '#71717a', fontWeight: '500', textAlign: 'center' }}>
							{label}
						</Text>
						{focused === i && (
							<Text style={{ color: '#c7d2fe', fontSize: 11, textAlign: 'center', marginTop: 4 }}>Focused ❆</Text>
						)}
					</Pressable>
				))}
			</View>
		</View>
	);
}

export default function SpatialNavigationFocusableViewPage() {
	return (
		<DocPage
			title="SpatialNavigationFocusableView"
			description="Wraps a View into a focusable spatial navigation node. Exposes isFocused state to children via a render-prop and fires lifecycle events — onFocus, onBlur, onSelect, onLongSelect."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Usage with SpatialNavigationView',
					content: (
						<View className="gap-3">
							<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="focusable-view.tsx" height={180}>
								<FocusableViewDemo />
							</ComponentPreview>
							<Text className="text-zinc-400 text-sm leading-6">
								Nest <Text className="text-amber-300 font-mono">SpatialNavigationFocusableView</Text> inside a{' '}
								<Text className="text-amber-300 font-mono">SpatialNavigationView</Text> to define the navigation
								direction between siblings.
							</Text>
							<CodeBlock code={BASIC_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'DefaultFocus',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Wrap a node in <Text className="text-amber-300 font-mono">DefaultFocus</Text> to make it the initial
								focused element when its parent root activates.
							</Text>
							<CodeBlock code={DEFAULT_FOCUS_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Programmatic focus via SpatialNavigationNode',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Use the lower-level <Text className="text-amber-300 font-mono">SpatialNavigationNode</Text> with a ref
								typed as <Text className="text-amber-300 font-mono">SpatialNavigationNodeRef</Text> to focus a node
								programmatically.
							</Text>
							<CodeBlock code={REF_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Accessibility',
					content: (
						<Callout type="info">
							SpatialNavigationFocusableView automatically applies the correct accessibility props via the{' '}
							<Text className="text-amber-300 font-mono">useSpatialNavigatorFocusableAccessibilityProps</Text> hook. You
							can also call this hook directly to apply nav accessibility props to your own components.
						</Callout>
					),
				},
				{
					title: 'FocusableView props',
					content: <PropsTable props={FOCUSABLE_VIEW_PROPS} />,
				},
				{
					title: 'SpatialNavigationNode props',
					content: <PropsTable props={NODE_PROPS} />,
				},
			]}
		/>
	);
}
