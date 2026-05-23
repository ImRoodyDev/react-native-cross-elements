import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';

const IMPORT_CODE = `import { Portal, PortalHost } from 'react-native-cross-elements';`;

const ROOT_SETUP = `// app/_layout.tsx (or your root layout)
import { PortalHost } from 'react-native-cross-elements';

export default function RootLayout({ children }) {
  return (
    <View style={{ flex: 1 }}>
      {/* Mount PortalHost at the top level so portals render above everything */}
      <PortalHost />
      {children}
    </View>
  );
}`;

const TOAST_EXAMPLE = `import React from 'react';
import { View, Text } from 'react-native';
import { Portal } from 'react-native-cross-elements';

export function ToastDemo() {
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const show = setInterval(() => setMessage('Saved ✅'), 5000);
    const hide = setInterval(() => setMessage(null), 6500);
    return () => { clearInterval(show); clearInterval(hide); };
  }, []);

  return (
    <Portal>
      {message && (
        <View
          style={{
            position: 'absolute',
            bottom: 24,
            left: 0,
            right: 0,
            alignItems: 'center',
            // Important: enable touches for portal content
            pointerEvents: 'auto',
          }}
        >
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              backgroundColor: '#18181b',
              borderWidth: 1,
              borderColor: '#27272a',
            }}
          >
            <Text style={{ color: '#e4e4e7' }}>{message}</Text>
          </View>
        </View>
      )}
    </Portal>
  );
}`;

const POPOVER_EXAMPLE = `import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Portal } from 'react-native-cross-elements';

export function PopoverDemo() {
  const [visible, setVisible] = React.useState(false);

  return (
    <View style={{ padding: 24 }}>
      <Pressable onPress={() => setVisible((v) => !v)}>
        <Text style={{ color: '#818cf8' }}>Toggle popover</Text>
      </Pressable>

      <Portal>
        {visible && (
          <View
            style={{
              position: 'absolute',
              top: 120,
              left: 24,
              pointerEvents: 'auto',
            }}
          >
            <View
              style={{
                padding: 12,
                backgroundColor: '#18181b',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#27272a',
              }}
            >
              <Text style={{ color: 'white' }}>I'm a popover rendered outside the tree</Text>
            </View>
          </View>
        )}
      </Portal>
    </View>
  );
}`;

const MULTI_HOST_EXAMPLE = `// Multiple named hosts at the root
<PortalHost name="top_layer" />
<PortalHost name="hud" />

// Target a specific host
<Portal portalName="hud">
  {/* HUD content */}
</Portal>

<Portal portalName="top_layer">
  {/* Modal content */}
</Portal>`;

function PortalDemo() {
	const [visible, setVisible] = useState(false);
	const showToast = () => {
		setVisible(true);
		setTimeout(() => setVisible(false), 2000);
	};
	return (
		<View style={{ alignItems: 'center', gap: 16, height: 120, justifyContent: 'center' }}>
			<Pressable
				onPress={showToast}
				style={({ pressed }) => ({
					paddingHorizontal: 20,
					paddingVertical: 12,
					borderRadius: 10,
					backgroundColor: pressed ? '#4f46e5' : '#6366f1',
					transform: [{ scale: pressed ? 0.96 : 1 }],
				})}
			>
				<Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>Show Toast</Text>
			</Pressable>
			{visible && (
				<View
					style={{
						position: 'absolute',
						bottom: 0,
						backgroundColor: '#27272a',
						paddingVertical: 10,
						paddingHorizontal: 20,
						borderRadius: 8,
						borderWidth: 1,
						borderColor: '#3f3f46',
					}}
				>
					<Text style={{ color: '#e4e4e7', fontSize: 14 }}>Saved ✅</Text>
				</View>
			)}
		</View>
	);
}

export default function PortalPage() {
	return (
		<DocPage
			title="Portal"
			description="Render UI outside the normal view hierarchy using a PortalHost. Perfect for overlays, modals, toasts, and tooltips that need to escape clipping or render above all other content."
			platforms={['ios', 'android', 'web']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Interactive demo',
					content: (
						<ComponentPreview code={IMPORT_CODE} language="tsx" label="portal.tsx" height={160}>
							<PortalDemo />
						</ComponentPreview>
					),
				},
				{
					title: 'How it works',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Mount a <Text className="text-amber-300 font-mono">{'<PortalHost />'}</Text> at the root of your app.
								Any <Text className="text-amber-300 font-mono">{'<Portal>'}</Text> rendered anywhere in the tree will
								inject its children into the host's absolute, top-layer container (zIndex 1000).
							</Text>
							<Callout type="warning">
								The host container has pointerEvents: 'none'. You must add pointerEvents: 'auto' to your overlay's
								outermost View to receive touches/clicks.
							</Callout>
						</View>
					),
				},
				{
					title: 'Setup — mount PortalHost',
					content: <CodeBlock code={ROOT_SETUP} language="tsx" />,
				},
				{
					title: 'Toast example',
					content: <CodeBlock code={TOAST_EXAMPLE} language="tsx" />,
				},
				{
					title: 'Popover / anchored overlay',
					content: <CodeBlock code={POPOVER_EXAMPLE} language="tsx" />,
				},
				{
					title: 'Multiple named hosts',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Mount multiple hosts with different <Text className="text-amber-300 font-mono">name</Text> props and
								target them with <Text className="text-amber-300 font-mono">portalName</Text> on the Portal. Default
								name is <Text className="text-amber-300 font-mono">'root_ui_portal'</Text>.
							</Text>
							<CodeBlock code={MULTI_HOST_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Dropdown integration',
					content: (
						<Callout type="info">
							The Dropdown component auto-detects a mounted PortalHost and renders its window into it. Without a
							PortalHost it falls back to a native Modal.
						</Callout>
					),
				},
			]}
		/>
	);
}
