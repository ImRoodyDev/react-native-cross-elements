import React, { useState } from 'react';
import { Text } from 'react-native';
import { BaseButton } from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { Ripple } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import { BaseButton } from 'react-native-cross-elements';
import { Text } from 'react-native';

export default function Example() {
  return (
    <BaseButton
      enableRipple
      rippleColor="rgba(255,255,255,0.22)"
      rippleDuration={420}
      backgroundColor="#4f46e5"
      pressedBackgroundColor="#4338ca"
      selectedBackgroundColor="#6366f1"
      textColor="#e0e7ff"
      focusedTextColor="#ffffff"
      style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}
    >
      {({ currentTextColor }) => (
        <Text style={{ color: currentTextColor, fontWeight: '700' }}>Press for ripple</Text>
      )}
    </BaseButton>
  );
}`;

const LOW_LEVEL_EXAMPLE = `// Ripple is the low-level visual primitive used by BaseButton.
// Most apps enable it through BaseButton props:
<BaseButton enableRipple rippleColor="rgba(255,255,255,0.22)" />`;

const PROPS: PropRow[] = [
	{ name: 'ripple', type: 'RippleConfig', required: true, description: 'Animated ripple position, size, and progress.' },
	{ name: 'color', type: 'ColorValue', required: true, description: 'Ripple fill color.' },
];

function RippleDemo() {
	const [count, setCount] = useState(0);

	return (
		<BaseButton
			enableRipple
			rippleColor="rgba(255,255,255,0.22)"
			rippleDuration={420}
			backgroundColor="#4f46e5"
			pressedBackgroundColor="#4338ca"
			selectedBackgroundColor="#6366f1"
			textColor="#e0e7ff"
			focusedTextColor="#ffffff"
			onPress={() => setCount((next) => next + 1)}
			style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 }}
		>
			{({ currentTextColor }) => (
				<Text style={{ color: currentTextColor, fontWeight: '700' }}>Ripple pressed {count}</Text>
			)}
		</BaseButton>
	);
}

export default function RipplePage() {
	return (
		<DocPage
			title="Ripple"
			description="The low-level animated ripple effect used by the button primitives. Most apps enable it through BaseButton instead of rendering Ripple directly."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Preview',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="ripple.tsx" height={150}>
							<RippleDemo />
						</ComponentPreview>
					),
				},
				{
					title: 'Recommended usage',
					content: (
						<>
							<Callout type="tip">Use BaseButton ripple props unless you are building a custom primitive.</Callout>
							<CodeBlock code={LOW_LEVEL_EXAMPLE} language="tsx" />
						</>
					),
				},
				{ title: 'Props', content: <PropsTable props={PROPS} /> },
			]}
		/>
	);
}
