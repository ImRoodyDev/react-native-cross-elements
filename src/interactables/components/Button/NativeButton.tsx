import React, { useCallback, useTransition } from 'react';
import { ActivityIndicator, ColorValue, GestureResponderEvent, TextStyle } from 'react-native'; // Import the new BaseButton
import Animated from 'react-native-reanimated';
import clsx from 'clsx';
import { BaseButton, BaseButtonProps } from '../../base/BaseButton';
import { joinClsx } from '../../../utils/stringJoiner';

// Type definitions
export type NativeButtonProps = {
	/** Text label shown inside the button. */
	text?: string;
	/** Style for the text (color is controlled internally). */
	textStyle?: Omit<TextStyle, 'color'>;

	/** Render a left icon; receives current text color. */
	leftIconComponent?: (textColor: ColorValue | undefined) => React.ReactNode;
	/** Render a right icon; receives current text color. */
	rightIconComponent?: (textColor: ColorValue | undefined) => React.ReactNode;
	/** Custom loading indicator; gets current text color and focus state. */
	customIndicator?: (textColor: ColorValue | undefined, isFocused: boolean) => React.ReactNode;

	/** Prevent repeated presses while disabled or pending. */
	spamSafe?: boolean;
	/** Show a loading indicator while onPress is pending. */
	showIndicator?: boolean;
} & Omit<BaseButtonProps, 'children'>;

export const NativeButton: React.FC<NativeButtonProps> = (props: NativeButtonProps) => {
	const { onPress, leftIconComponent, rightIconComponent, text = '', textStyle, spamSafe = true, showIndicator = false, customIndicator, ...baseButtonProps } = props;

	// Indicator state
	const [isPending, startPending] = useTransition();

	// Handle pointer events
	const onPressHandler = useCallback(
		async (e: GestureResponderEvent) => {
			if ((baseButtonProps.disabled || isPending) && spamSafe) return;
			startPending(async () => {
				await onPress?.(e);
			});
		},
		[baseButtonProps.disabled, isPending, onPress, spamSafe]
	);

	return (
		<BaseButton {...baseButtonProps} onPress={onPressHandler}>
			{({ currentTextColor, isFocused }) =>
				isPending && showIndicator ? (
					customIndicator ? (
						customIndicator(currentTextColor, isFocused)
					) : (
						<ActivityIndicator color={currentTextColor} />
					)
				) : (
					<>
						{leftIconComponent?.(currentTextColor)}
						<Animated.Text
							selectable={false}
							numberOfLines={1}
							adjustsFontSizeToFit
							// ts-expect-error TODO: accept classname if Tailwind or Nativewind is in the user environment
							className={clsx('base-btn-txt', joinClsx(baseButtonProps.className?.split(' ').toReversed()[0], 'txt'))}
							style={[textStyle, { color: currentTextColor }]}
						>
							{text}
						</Animated.Text>
						{rightIconComponent?.(currentTextColor)}
					</>
				)
			}
		</BaseButton>
	);
};
