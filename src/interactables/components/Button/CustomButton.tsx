import React, {Ref, useCallback, useTransition} from 'react';
import {BaseButton, BaseButtonProps} from '../../base/BaseButton';
import {ActivityIndicator, ColorValue, GestureResponderEvent, Pressable} from "react-native";

// Type definitions
export type CustomButtonProps = {
	/** Block presses while disabled or pending to prevent spamming. */
	spamSafe?: boolean;
	/** Show a loading indicator while onPress is pending. */
	showIndicator?: boolean;
	/** Custom loading indicator renderer; receives current text color and focus state. */
	customIndicator?: (textColor: ColorValue | undefined, isFocused: boolean) => React.ReactNode
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
export const CustomButton = React.forwardRef((props: CustomButtonProps, ref?: Ref<React.ComponentRef<typeof Pressable>>) => {
	const {
		onPress,
		children,
		spamSafe = true,
		showIndicator = false,
		customIndicator,
		...baseButtonProps
	} = props;

	// Indicator state
	const [isPending, startPending] = useTransition();

	// Handle pointer events
	const onPressHandler = useCallback(async (e: GestureResponderEvent) => {
		if ((baseButtonProps.disabled || isPending) && spamSafe) return;
		startPending(async () => {
			await onPress?.(e);
		});
	}, [baseButtonProps.disabled, isPending, onPress, spamSafe]);

	return (
		<BaseButton ref={ref} {...baseButtonProps} onPress={onPressHandler}>
			{
				({currentTextColor, isFocused}) => (
					isPending && showIndicator ?
						customIndicator ? customIndicator(currentTextColor, isFocused) : <ActivityIndicator color={currentTextColor}/>
						:
						(
							typeof children === 'function' ?
								children({currentTextColor, isFocused}) : children
						)
				)
			}
		</BaseButton>
	);
});
CustomButton.displayName = 'CustomButton';
