import React, {forwardRef, PropsWithoutRef, ReactElement, RefAttributes} from 'react';

/**
 * This works like React.forwardRef but for components with generic props.
 * @warning Don't use this if your component type isn't generic => `const Component = <T>() => {...}` and displayName is not supported yet
 */
export function typedForwardRef<T, P = unknown>
(render: (props: PropsWithoutRef<P>, ref: React.Ref<T>) => ReactElement | null):
	(props: P & RefAttributes<T>) => ReactElement | null {
	// forwardRef expects (props: PropsWithoutRef<P>, ref: ForwardedRef<T>)
	return forwardRef(render) as unknown as (props: P & RefAttributes<T>) => ReactElement | null;
}

// export type TypedForwardRef = <T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactNode,) =>
// (props: P & React.RefAttributes<T>) => React.ReactNode;
//
// export const typedForwardRef = forwardRef as TypedForwardRef;
