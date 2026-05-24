import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import {
	BaseRemoteControl,
	DefaultFocus,
	Directions,
	SpatialNavigation,
	SpatialNavigationDeviceTypeProvider,
	SpatialNavigationFocusableView,
	SpatialNavigationRoot,
	SpatialNavigationView,
} from 'react-native-cross-elements';
import { DocPage, Callout } from '../../../components/DocPage';
import { CodeBlock } from '../../../components/CodeBlock';
import { ComponentPreview } from '../../../components/ComponentPreview';
import { PropsTable, type PropRow } from '../../../components/PropsTable';

const IMPORT_CODE = `import {
  SpatialNavigationRoot,
  SpatialNavigationDeviceTypeProvider,
  SpatialNavigation,
  BaseRemoteControl,
  Directions,
  type RemoteControlConfiguration,
} from 'react-native-cross-elements';`;

const REMOTE_CONTROL_EXAMPLE = `// External imports
import {
  BaseRemoteControl,
  Directions,
} from 'react-native-cross-elements';

export enum SupportedKeys {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Enter = 'Enter',
  Backspace = 'Backspace',
  LongEnter = 'LongEnter',
}

export const MapSupportedKeys: Readonly<Record<SupportedKeys, Directions>> = {
  [SupportedKeys.ArrowUp]: Directions.UP,
  [SupportedKeys.ArrowDown]: Directions.DOWN,
  [SupportedKeys.ArrowLeft]: Directions.LEFT,
  [SupportedKeys.ArrowRight]: Directions.RIGHT,
  [SupportedKeys.Enter]: Directions.ENTER,
  [SupportedKeys.Backspace]: Directions.UNSPECIFIED,
  [SupportedKeys.LongEnter]: Directions.LONG_ENTER,
};

export class RemoteControlManager extends BaseRemoteControl<SupportedKeys> {
  private isEnterKeyDown = false;
  private longEnterTimeout: NodeJS.Timeout | number | null = null;

  constructor() {
    super();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === SupportedKeys.Enter) {
      if (!this.isEnterKeyDown) {
        this.isEnterKeyDown = true;
        this.handleLongEnter();
      }
      return;
    }
    this.eventEmitter.emit('keyDown', event.code as SupportedKeys);
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === SupportedKeys.Enter) {
      this.isEnterKeyDown = false;
      if (this.longEnterTimeout) {
        clearTimeout(this.longEnterTimeout);
        this.eventEmitter.emit('keyDown', event.code as SupportedKeys);
      }
    }
  };

  private handleLongEnter = () => {
    this.longEnterTimeout = setTimeout(() => {
      this.eventEmitter.emit('keyDown', SupportedKeys.LongEnter);
      this.longEnterTimeout = null;
    }, 500);
  };
}`;

const BASIC_EXAMPLE = `import React from 'react';
import { Text, View } from 'react-native';
import {
  DefaultFocus,
  SpatialNavigationDeviceTypeProvider,
  SpatialNavigationRoot,
  SpatialNavigationView,
  SpatialNavigationFocusableView,
  SpatialNavigation,
} from 'react-native-cross-elements';
import {
  MapSupportedKeys,
  RemoteControlManager,
} from './RemoteControlManager';

const remoteControlManager = new RemoteControlManager();

function useRemoteControlSetup() {
  React.useEffect(() => {
    SpatialNavigation.configureRemoteControl({
      mappedDirection: MapSupportedKeys,
      remoteControlSubscriber: remoteControlManager.addKeydownListener,
      remoteControlUnsubscriber: remoteControlManager.removeKeydownListener,
    });
  }, []);
}

export default function App() {
  useRemoteControlSetup();

  return (
    <SpatialNavigationDeviceTypeProvider>
      <SpatialNavigationRoot>
        <SpatialNavigationView direction="horizontal">
          {['Home', 'Movies', 'Shows'].map((label, index) => {
            const item = (
              <SpatialNavigationFocusableView
                key={label}
                onSelect={() => console.log('Selected', label)}
              >
                {({ isFocused }) => (
                  <View
                    style={{
                      marginRight: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 10,
                      backgroundColor: isFocused ? '#6366f1' : '#18181b',
                    }}
                  >
                    <Text style={{ color: 'white' }}>{label}</Text>
                  </View>
                )}
              </SpatialNavigationFocusableView>
            );

            return index === 0 ? (
              <DefaultFocus key={label}>{item}</DefaultFocus>
            ) : (
              item
            );
          })}
        </SpatialNavigationView>
      </SpatialNavigationRoot>
    </SpatialNavigationDeviceTypeProvider>
  );
}`;

const LOCK_EXAMPLE = `import { useLockSpatialNavigation } from 'react-native-cross-elements';

function Modal({ visible }) {
  // Lock navigation when a modal is open (prevents focus leaving)
  useLockSpatialNavigation(!visible);

  return visible ? <ModalContent /> : null;
}`;

const ROOT_PROPS: PropRow[] = [
	{ name: 'isActive', type: 'boolean', default: 'true', description: 'Activate or pause the navigation context.' },
	{
		name: 'onDirectionHandledWithoutMovement',
		type: '(dir: Directions) => void',
		description: 'Called when a direction key was pressed but focus did not move.',
	},
	{ name: 'children', type: 'ReactNode', required: true, description: 'The navigable subtree.' },
];

const DEVICE_PROVIDER_PROPS: PropRow[] = [
	{ name: 'children', type: 'ReactNode', required: true, description: 'App or subtree to wrap.' },
];

const REMOTE_CONFIG_PROPS: PropRow[] = [
	{
		name: 'mappedDirection',
		type: 'Record<string, Directions>',
		required: true,
		description: 'Map remote or keyboard key identifiers to Directions, including Directions.ENTER for select.',
	},
	{
		name: 'remoteControlSubscriber',
		type: '(callback) => subscriber',
		required: true,
		description: 'Subscribe to key events and return the subscriber handle.',
	},
	{
		name: 'remoteControlUnsubscriber',
		type: '(subscriber) => void',
		required: true,
		description: 'Unsubscribe the listener.',
	},
];

enum SupportedKeys {
	ArrowRight = 'ArrowRight',
	ArrowLeft = 'ArrowLeft',
	ArrowUp = 'ArrowUp',
	ArrowDown = 'ArrowDown',
	Enter = 'Enter',
	Backspace = 'Backspace',
	LongEnter = 'LongEnter',
}

const MapSupportedKeys = {
	[SupportedKeys.ArrowUp]: Directions.UP,
	[SupportedKeys.ArrowDown]: Directions.DOWN,
	[SupportedKeys.ArrowLeft]: Directions.LEFT,
	[SupportedKeys.ArrowRight]: Directions.RIGHT,
	[SupportedKeys.Enter]: Directions.ENTER,
	[SupportedKeys.Backspace]: Directions.UNSPECIFIED,
	[SupportedKeys.LongEnter]: Directions.LONG_ENTER,
};

class DocsRemoteControlManager extends BaseRemoteControl<SupportedKeys> {
	private isEnterKeyDown = false;
	private longEnterTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		super();
		if (typeof window === 'undefined') return;
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	dispose = () => {
		if (typeof window === 'undefined') return;
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		if (this.longEnterTimeout) {
			clearTimeout(this.longEnterTimeout);
			this.longEnterTimeout = null;
		}
	};

	private handleKeyDown = (event: KeyboardEvent) => {
		const key = event.code as SupportedKeys;
		if (!(key in MapSupportedKeys)) return;
		event.preventDefault();

		if (key === SupportedKeys.Enter) {
			if (!this.isEnterKeyDown) {
				this.isEnterKeyDown = true;
				this.handleLongEnter();
			}
			return;
		}

		this.emitKeyDown(key);
	};

	private handleKeyUp = (event: KeyboardEvent) => {
		if (event.code !== SupportedKeys.Enter) return;

		this.isEnterKeyDown = false;
		if (this.longEnterTimeout) {
			clearTimeout(this.longEnterTimeout);
			this.longEnterTimeout = null;
			this.emitKeyDown(SupportedKeys.Enter);
		}
	};

	private handleLongEnter = () => {
		this.longEnterTimeout = setTimeout(() => {
			this.emitKeyDown(SupportedKeys.LongEnter);
			this.longEnterTimeout = null;
		}, 500);
	};
}

function SpatialRootDemo() {
	const [focused, setFocused] = useState<number | null>(null);
	const [selected, setSelected] = useState<number | null>(null);
	const [ready, setReady] = useState(false);
	const items = ['Home', 'Movies', 'Shows', 'Sports'];

	useEffect(() => {
		const remoteControlManager = new DocsRemoteControlManager();

		SpatialNavigation.configureRemoteControl({
			mappedDirection: MapSupportedKeys,
			remoteControlSubscriber: remoteControlManager.addKeydownListener,
			remoteControlUnsubscriber: remoteControlManager.removeKeydownListener,
		});

		setReady(true);
		return () => remoteControlManager.dispose();
	}, []);

	if (!ready) {
		return (
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ color: '#71717a', fontSize: 13 }}>Preparing keyboard navigation...</Text>
			</View>
		);
	}

	return (
		<SpatialNavigationDeviceTypeProvider>
			<SpatialNavigationRoot>
				<View style={{ gap: 12, alignItems: 'center' }}>
					<Text style={{ color: '#52525b', fontSize: 12 }}>Use ArrowLeft / ArrowRight, then Enter to select</Text>
					<SpatialNavigationView direction="horizontal" style={{ gap: 8 }}>
						{items.map((label, i) => {
							const item = (
								<SpatialNavigationFocusableView
									key={label}
									onFocus={() => setFocused(i)}
									onBlur={() => setFocused((current) => (current === i ? null : current))}
									onSelect={() => setSelected(i)}
									onLongSelect={() => setSelected(i)}
								>
									{({ isFocused }) => {
										const isSelected = selected === i;
										return (
											<View
												style={{
													paddingHorizontal: 16,
													paddingVertical: 10,
													borderRadius: 10,
													backgroundColor: isSelected ? '#6366f1' : isFocused ? '#27272a' : '#18181b',
													borderWidth: 1,
													borderColor: isFocused || isSelected ? '#6366f1' : '#27272a',
												}}
											>
												<Text
													style={{
														color: isSelected || isFocused ? '#ffffff' : '#a1a1aa',
														fontWeight: isSelected ? '600' : '500',
														fontSize: 14,
													}}
												>
													{label}
												</Text>
											</View>
										);
									}}
								</SpatialNavigationFocusableView>
							);

							return i === 0 ? (
								<DefaultFocus key={label}>{item}</DefaultFocus>
							) : (
								item
							);
						})}
					</SpatialNavigationView>
					<Text style={{ color: '#52525b', fontSize: 13 }}>
						Focused: {focused === null ? 'none' : items[focused]} {selected !== null ? `- Selected: ${items[selected]}` : ''}
					</Text>
				</View>
			</SpatialNavigationRoot>
		</SpatialNavigationDeviceTypeProvider>
	);
}

export default function SpatialNavigationRootPage() {
	return (
		<DocPage
			title="SpatialNavigationRoot"
			description="The top-level provider for the spatial navigation engine. Wrap your app (or the navigable section) with this component to enable LRUD-powered focus management for TV, remote, and keyboard navigation."
			platforms={['ios', 'android', 'web', 'tv']}
			importCode={IMPORT_CODE}
			sections={[
				{
					title: 'Interactive demo',
					content: (
						<ComponentPreview code={BASIC_EXAMPLE} language="tsx" label="spatial-navigation-root.tsx" height={180}>
							<SpatialRootDemo />
						</ComponentPreview>
					),
				},
				{
					title: 'Remote control manager',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Create one manager for your platform key events, emit each supported key, and map those keys to{' '}
								<Text className="text-amber-300 font-mono">Directions</Text>. On web, the manager can subscribe to{' '}
								<Text className="text-amber-300 font-mono">window</Text> keyboard events. On a TV platform, use the
								remote event API from that platform and emit the same supported keys.
							</Text>
							<CodeBlock code={REMOTE_CONTROL_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'Full setup example',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Configure the remote once, pass the manager subscriber/unsubscriber into{' '}
								<Text className="text-amber-300 font-mono">SpatialNavigation.configureRemoteControl</Text>, then wrap
								the navigable tree.
							</Text>
							<CodeBlock code={BASIC_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'BaseRemoteControl',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Extend <Text className="text-amber-300 font-mono">{'BaseRemoteControl<KeyType>'}</Text>, emit{' '}
								<Text className="text-amber-300 font-mono">keyDown</Text> events from your keyboard or remote listener,
								and use <Text className="text-amber-300 font-mono">addKeydownListener</Text> /{' '}
								<Text className="text-amber-300 font-mono">removeKeydownListener</Text> as the subscriber/unsubscriber
								in <Text className="text-amber-300 font-mono">configureRemoteControl</Text>.
							</Text>
						</View>
					),
				},
				{
					title: 'Locking navigation',
					content: (
						<View className="gap-3">
							<Text className="text-zinc-400 text-sm leading-6">
								Use the <Text className="text-amber-300 font-mono">useLockSpatialNavigation</Text> hook to pause/resume
								the navigation context, useful when a modal or overlay captures focus.
							</Text>
							<CodeBlock code={LOCK_EXAMPLE} language="tsx" />
						</View>
					),
				},
				{
					title: 'SpatialNavigationRoot props',
					content: <PropsTable props={ROOT_PROPS} />,
				},
				{
					title: 'SpatialNavigationDeviceTypeProvider props',
					content: (
						<View className="gap-3">
							<Callout type="info">
								SpatialNavigationDeviceTypeProvider detects whether the user is using a pointer (mouse/touch) or a
								remote/keyboard and adjusts focus behavior accordingly.
							</Callout>
							<PropsTable props={DEVICE_PROVIDER_PROPS} />
						</View>
					),
				},
				{
					title: 'RemoteControlConfiguration',
					content: <PropsTable props={REMOTE_CONFIG_PROPS} />,
				},
			]}
		/>
	);
}
