import React from 'react';
import { Text, View } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import { PortalHost } from 'react-native-cross-elements';`;

const SETUP_EXAMPLE = `import { PortalHost } from 'react-native-cross-elements';

export default function RootLayout({ children }) {
  return (
    <>
      <PortalHost />
      {children}
    </>
  );
}`;

const NAMED_HOST_EXAMPLE = `<PortalHost name="top_layer" />

<Portal portalName="top_layer">
  <Toast />
</Portal>`;

const PROPS: PropRow[] = [
	{ name: 'name', type: 'string', default: "'root_ui_portal'", description: 'Host name targeted by Portal.' },
];

export default function PortalHostPage() {
	return (
		<DocPage
			title="PortalHost"
			description="The root host layer that receives Portal content. Mount it once near the top of your app so overlays, dropdowns, and toasts can escape local clipping."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Preview',
					content: (
						<ComponentPreview code={SETUP_EXAMPLE} language="tsx" label="root-layout.tsx" height={140}>
							<View style={{ alignItems: 'center', gap: 8 }}>
								<Text style={{ color: '#e4e4e7', fontWeight: '700' }}>PortalHost mounted at the app root</Text>
								<Text style={{ color: '#71717a', fontSize: 13, textAlign: 'center' }}>
									Portals render into this top-level layer.
								</Text>
							</View>
						</ComponentPreview>
					),
				},
				{ title: 'Root setup', content: <CodeBlock code={SETUP_EXAMPLE} language="tsx" /> },
				{ title: 'Named hosts', content: <CodeBlock code={NAMED_HOST_EXAMPLE} language="tsx" /> },
				{
					title: 'Pointer events',
					content: (
						<Callout type="warning">
							PortalHost keeps the host layer transparent to pointer events. Add pointerEvents="auto" to interactive
							portal content.
						</Callout>
					),
				},
				{ title: 'Props', content: <PropsTable props={PROPS} /> },
			]}
		/>
	);
}
