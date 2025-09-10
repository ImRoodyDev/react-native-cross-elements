import {ComponentProps, ComponentType, memo} from 'react';

type PropsComparator<C extends ComponentType> = (
	prevProps: Readonly<ComponentProps<C>>,
	nextProps: Readonly<ComponentProps<C>>,
) => boolean;

/**
 * This works like React.memo but for components with generics props.
 * See issue: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37087
 * @warning Don't use this if your component type isn't generic => `const Component = <T>() => {...}`
 */

export function typedMemo<C extends ComponentType<any>>(
	Component: C,
	propsAreEqual?: PropsComparator<C>,
) {
	return memo(Component, propsAreEqual) as unknown as C & { displayName?: string };
}

// export type TypedMemo = <T extends React.ComponentType<any>>(
// 	Component: T,
// 	propsAreEqual?: (
// 		prevProps: Readonly<React.JSXElementConstructor<T>>,
// 		nextProps: Readonly<React.JSXElementConstructor<T>>,
// 	) => boolean,
// ) => T & { displayName?: string };
//
// export const typedMemo = memo as TypedMemo;