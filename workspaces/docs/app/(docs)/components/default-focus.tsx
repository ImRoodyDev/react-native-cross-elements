import React from 'react';
import { View, Text } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';

const IMPORT_CODE = `import { DefaultFocus } from 'react-native-cross-elements';`;

const BASIC_EXAMPLE = `import {
  DefaultFocus,
  SpatialNavigationFocusableView,
  SpatialNavigationView,
} from 'react-native-cross-elements';

<SpatialNavigationView direction="horizontal">
  <SpatialNavigationFocusableView>{() => <Card>First</Card>}</SpatialNavigationFocusableView>
  <DefaultFocus>
    <SpatialNavigationFocusableView>{() => <Card>Starts focused</Card>}</SpatialNavigationFocusableView>
  </DefaultFocus>
</SpatialNavigationView>`;

export default function DefaultFocusPage() {
	return (
		<DocPage
			title="DefaultFocus"
			description="Marks which focusable child should receive focus first when a spatial navigation area becomes active."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Preview',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} label="default-focus.tsx" height={150}>
							<View style={{ alignItems: 'center', gap: 10 }}>
								<Text style={{ color: '#e4e4e7', fontWeight: '700' }}>Second item starts focused</Text>
								<Text style={{ color: '#52525b', fontSize: 13 }}>Wrap one child in DefaultFocus.</Text>
							</View>
						</ComponentPreview>
					),
				},
				{ title: 'Usage', content: <CodeBlock code={BASIC_EXAMPLE} language="tsx" /> },
				{ title: 'Tip', content: <Callout type="info">Use one DefaultFocus per active navigation group to avoid ambiguous initial focus.</Callout> },
			]}
		/>
	);
}
