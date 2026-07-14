import React, { Ref, useCallback, useState } from 'react';
import { BaseButton, BaseButtonProps } from '../../base/BaseButton';
import { ActivityIndicator, ColorValue, GestureResponderEvent, Pressable } from 'react-native';

// Type definitions
export type CustomButtonProps = {
	/** Block presses while disabled or pending to prevent spamming. */
	spamSafe?: boolean;
	/** Show a loading indicator while onPress is pending. */
	showIndicator?: boolean;
	/** Custom loading indicator renderer; receives current text color and focus state. */
	customIndicator?: (textColor: ColorValue | undefined, isFocused: boolean) => React.ReactNode;
} & BaseButtonProps;

/**
 * CustomButton component that wraps BaseButton and adds loading indicator and spam protection.
 * - `spamSafe`: Prevents multiple presses while the button is disabled or an action is pending.
 * - `showIndicator`: Displays a loading indicator when the onPress action is pending.
 * - `customIndicator`: Allows custom rendering of the loading indicator.
 * - Children can be a function that receives current text color and focus state for dynamic rendering.
 * - All other props are passed down to BaseButton.
 *  @see BaseButton
 */
const CustomButtonInner = React.forwardRef((props: CustomButtonProps, ref?: Ref<React.ComponentRef<typeof Pressable>>) => {
	const { onPress, children, spamSafe = true, showIndicator = false, customIndicator, ...baseButtonProps } = props;

	// Indicator state
	const [isPending, startPending] = useState(false);

	// Handle pointer events
	const onPressHandler = useCallback(
		async (e: GestureResponderEvent) => {
			if ((baseButtonProps.disabled || isPending) && spamSafe) return;
			startPending(true);
			await onPress?.(e);
			startPending(false);
			// startPending(async () => {
			// 	await onPress?.(e);
			// });
		},
		[baseButtonProps.disabled, isPending, onPress, spamSafe]
	);

	// Memoized: an inline render prop here hands BaseButton a new `children` on every render, which
	// defeats its memo. Stable as long as the caller's own `children` reference is stable.
	const renderChildren = useCallback(
		(state: { currentTextColor: ColorValue | undefined; isFocused: boolean }) => {
			if (isPending && showIndicator) {
				return customIndicator ? (
					customIndicator(state.currentTextColor, state.isFocused)
				) : (
					<ActivityIndicator color={state.currentTextColor} />
				);
			}
			return typeof children === 'function' ? children(state) : children;
		},
		[isPending, showIndicator, customIndicator, children]
	);

	return (
		<BaseButton ref={ref} {...baseButtonProps} onPress={onPressHandler}>
			{renderChildren}
		</BaseButton>
	);
});
CustomButtonInner.displayName = 'CustomButton';

export const CustomButton = React.memo(CustomButtonInner);
