import React from 'react';
import * as ReactNative from 'react-native';
import { Platform, View, ViewProps } from 'react-native';

/**
 * Props for {@link FocusGuide}. Extends ViewProps, so it can be dropped in wherever a View sits.
 */
export type FocusGuideProps = ViewProps & {
	/**
	 * When the guide gains TV focus, redirect it to the last-focused (or first focusable)
	 * descendant instead of leaving focus on the guide itself.
	 */
	autoFocus?: boolean;
	/** Optional explicit focus destinations (react-native-tvos). */
	destinations?: unknown[];
	/** Block D-pad focus from leaving the guide upwards. */
	trapFocusUp?: boolean;
	/** Block D-pad focus from leaving the guide downwards. */
	trapFocusDown?: boolean;
	/** Block D-pad focus from leaving the guide to the left. */
	trapFocusLeft?: boolean;
	/** Block D-pad focus from leaving the guide to the right. */
	trapFocusRight?: boolean;
};

// react-native-tvos exports TVFocusGuideView; plain react-native (phone/web builds) does not.
// Resolved defensively off the namespace so this module never breaks a non-tvos bundle or web,
// where the import would otherwise be undefined at call time.
const TVFocusGuideView = (ReactNative as unknown as { TVFocusGuideView?: React.ComponentType<FocusGuideProps> })
	.TVFocusGuideView;

/**
 * TV spatial-navigation focus guide, with a plain `<View>` fallback everywhere else.
 *
 * On Android TV the native focus finder picks the geometrically "best" candidate in the pressed
 * direction. Content that it has no path into — anything inside a Modal or an absolutely positioned
 * overlay — is simply never reached, which leaves the D-pad dead. Wrapping that content in a focus
 * guide makes its whole area a valid focus target, and `autoFocus` forwards focus to a real
 * focusable inside it.
 *
 * IMPORTANT: keep the `trapFocus*` props tied to whether the content is actually visible. A trap
 * left armed around hidden content holds focus inside a view the user cannot see, which kills D-pad
 * navigation entirely — the exact failure it is meant to prevent.
 *
 * Off TV (and on any build without react-native-tvos) this renders a plain View and the focus props
 * are ignored, so it is always safe to render.
 */
export const FocusGuide = ({
	autoFocus,
	destinations,
	trapFocusUp,
	trapFocusDown,
	trapFocusLeft,
	trapFocusRight,
	...viewProps
}: FocusGuideProps) => {
	if (Platform.isTV && TVFocusGuideView) {
		return (
			<TVFocusGuideView
				autoFocus={autoFocus}
				destinations={destinations}
				trapFocusUp={trapFocusUp}
				trapFocusDown={trapFocusDown}
				trapFocusLeft={trapFocusLeft}
				trapFocusRight={trapFocusRight}
				{...viewProps}
			/>
		);
	}

	// Non-TV (web, phone): the guide is purely structural.
	return <View {...viewProps} />;
};

export default FocusGuide;
