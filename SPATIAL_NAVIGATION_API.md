# Spatial Navigation API

Dedicated reference for the spatial navigation primitives exported by `react-native-cross-elements`.

## Types

### <a id="focusableviewprops"></a>FocusableViewProps

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>children</td>
			<td>ReactElement | (state: FocusableNodeState) =&gt; ReactElement</td>
			<td>Content or render-prop with node state.</td>
		</tr>
		<tr>
			<td>...ViewProps</td>
			<td>React Native View props</td>
			<td>All view props except <code>children</code>.</td>
		</tr>
		<tr>
			<td>...SpatialNavigationNodeDefaultProps</td>
			<td>-</td>
			<td>Focus handlers plus orientation, grid alignment, index range, and additional offset.</td>
		</tr>
	</tbody>
</table>

### InnerFocusableViewProps

- Same as `FocusableViewProps` plus a `nodeState` object injected by `SpatialNavigationNode`.
- This is an internal helper type and usually does not need to be consumed directly.

### <a id="spatialnavigationnodedefaultprops"></a>SpatialNavigationNodeDefaultProps

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>orientation</td><td>'horizontal' | 'vertical'</td><td>'vertical'</td><td>Orientation for spatial navigation direction.</td></tr>
		<tr><td>onFocus</td><td>() =&gt; void</td><td>-</td><td>Called when the node receives focus.</td></tr>
		<tr><td>onBlur</td><td>() =&gt; void</td><td>-</td><td>Called when the node loses focus.</td></tr>
		<tr><td>onSelect</td><td>() =&gt; void</td><td>-</td><td>Called when the node is selected or pressed.</td></tr>
		<tr><td>onLongSelect</td><td>() =&gt; void</td><td>-</td><td>Called when the node is long pressed.</td></tr>
		<tr><td>onActive</td><td>() =&gt; void</td><td>-</td><td>Called when the node becomes active.</td></tr>
		<tr><td>onInactive</td><td>() =&gt; void</td><td>-</td><td>Called when the node becomes inactive.</td></tr>
		<tr><td>alignInGrid</td><td>boolean</td><td>false</td><td>Hint for grid alignment in LRUD navigation.</td></tr>
		<tr><td>indexRange</td><td>[number, number]</td><td>-</td><td>Index range used by virtualized components.</td></tr>
		<tr><td>additionalOffset</td><td>number</td><td>-</td><td>Extra scroll offset added during focus-driven scrolling.</td></tr>
	</tbody>
</table>

### <a id="spatialnavigationnoderef"></a>SpatialNavigationNodeRef

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Signature</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>focus</td><td>() =&gt; void</td><td>Imperatively focus the node.</td></tr>
	</tbody>
</table>

### <a id="spatialnavigationvirtualizedlistref"></a>SpatialNavigationVirtualizedListRef

<table>
	<thead>
		<tr>
			<th>Property / Method</th>
			<th>Signature / Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>focus</td><td>(index: number) =&gt; void</td><td>Focus an item at the given index.</td></tr>
		<tr><td>scrollTo</td><td>(index: number) =&gt; void</td><td>Scroll to an item at the given index.</td></tr>
		<tr><td>currentlyFocusedItemIndex</td><td>number</td><td>Last focused item index tracked by the list.</td></tr>
	</tbody>
</table>

### SpatialNavigationVirtualizedGridRef

- Alias of `SpatialNavigationVirtualizedListRef`.

### CustomScrollViewRef

<table>
	<thead>
		<tr>
			<th>Method</th>
			<th>Signature</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>getInnerViewNode</td><td>() =&gt; any</td><td>Returns the underlying scrollable node.</td></tr>
		<tr><td>scrollTo</td><td><code>({ x?, y?, animated }) =&gt; void</code></td><td>Scroll programmatically.</td></tr>
	</tbody>
</table>

### CustomScrollViewProps

<table>
	<thead>
		<tr>
			<th>Property</th>
			<th>Type</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>horizontal</td><td>boolean</td><td>Horizontal scroll mode.</td></tr>
		<tr><td>scrollDuration</td><td>number</td><td>Duration for CSS-based scrolling on web.</td></tr>
		<tr><td>onScroll</td><td><code>(event: { nativeEvent: { contentOffset: { x: number; y: number } } }) =&gt; void</code></td><td>Scroll event callback.</td></tr>
		<tr><td>...ScrollViewProps</td><td>Omit&lt;ScrollViewProps, 'onScroll' | 'onLayout'&gt;</td><td>All other scroll view props.</td></tr>
	</tbody>
</table>

### NodeOrientation

- `'horizontal' | 'vertical'`

### TypeVirtualizedListAnimation

<table>
	<thead>
		<tr>
			<th>Signature</th>
			<th>Returns</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><code>({ currentlyFocusedItemIndex, vertical?, scrollDuration, scrollOffsetsArray })</code></td>
			<td>Animated.WithAnimatedValue&lt;ViewStyle&gt;</td>
			<td>Computes the animated style for list transitions.</td>
		</tr>
	</tbody>
</table>

## Components

### <a id="spatialnavigationroot"></a>SpatialNavigationRoot

Top-level provider that enables spatial navigation, remote handling, and focus management.

<table>
	<thead>
		<tr>
			<th>Prop</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>isActive</td><td>boolean</td><td>true</td><td>Locks or unlocks the root. Set false to disable focus handling for an inactive screen.</td></tr>
		<tr><td>onDirectionHandledWithoutMovement</td><td>(direction: 'up' | 'down' | 'left' | 'right') =&gt; void</td><td>-</td><td>Called when navigation reaches a border without moving focus. Useful for switching between sibling roots such as a side menu and page content.</td></tr>
		<tr><td>children</td><td>ReactNode</td><td>required</td><td>Subtree controlled by this navigation root.</td></tr>
	</tbody>
</table>

### <a id="spatialnavigationview"></a>SpatialNavigationView

Container that participates in spatial navigation when a root exists. Otherwise it falls back to a regular view.

<table>
	<thead>
		<tr>
			<th>Prop</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>children</td><td>React.ReactNode</td><td>required</td><td>Content to render. Can include focusable descendants.</td></tr>
		<tr><td>direction</td><td>'horizontal' | 'vertical'</td><td>'horizontal'</td><td>Layout direction for arranging children.</td></tr>
		<tr><td>alignInGrid</td><td>boolean</td><td>false</td><td>Hint to align focusable children as a grid.</td></tr>
		<tr><td>...ViewProps</td><td>Omit&lt;ViewProps, 'children' | 'accessibilityState' | 'accessibilityRole'&gt;</td><td>-</td><td>Pass-through view props.</td></tr>
	</tbody>
</table>

### <a id="spatialnavigationscrollview"></a>SpatialNavigationScrollView

Scroll view that keeps the focused child visible while navigating with a remote or keyboard.

<table>
	<thead>
		<tr>
			<th>Prop</th>
			<th>Type</th>
			<th>Default</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr><td>horizontal</td><td>boolean</td><td>false</td><td>Horizontal scroll direction.</td></tr>
		<tr><td>offsetFromStart</td><td>number</td><td>0</td><td>Extra margin from the start edge when auto-scrolling to a focused element.</td></tr>
		<tr><td>pointerScrollSpeed</td><td>number</td><td>10</td><td>Pixels scrolled every 10ms while hovering the arrow areas with a remote pointer.</td></tr>
		<tr><td>useNativeScroll</td><td>boolean</td><td>false</td><td>Use native ScrollView instead of the CSS-based web implementation.</td></tr>
		<tr><td>scrollDuration</td><td>number</td><td>200</td><td>Duration for CSS-based smooth scrolling on web.</td></tr>
		<tr><td>ascendingArrow</td><td>ReactElement</td><td>-</td><td>Arrow rendered in the up or left control area.</td></tr>
		<tr><td>descendingArrow</td><td>ReactElement</td><td>-</td><td>Arrow rendered in the down or right control area.</td></tr>
		<tr><td>ascendingArrowContainerStyle</td><td>ViewStyle</td><td>-</td><td>Style for the up or left hover area.</td></tr>
		<tr><td>descendingArrowContainerStyle</td><td>ViewStyle</td><td>-</td><td>Style for the down or right hover area.</td></tr>
		<tr><td>...CustomScrollViewProps</td><td>CustomScrollViewProps</td><td>-</td><td>All custom/native scroll view props.</td></tr>
	</tbody>
</table>

### <a id="spatialnavigationfocusableview"></a>SpatialNavigationFocusableView

Focusable wrapper that renders a view and exposes node state to its children.

- See `FocusableViewProps` above.
- Use the render-prop form of `children` when you need `isFocused`, `isActive`, or `isRootActive`.

### <a id="spatialnavigationnode"></a>SpatialNavigationNode

Low-level focusable node used internally by `SpatialNavigationFocusableView`.

- Exposes focus lifecycle hooks and imperative focus via `SpatialNavigationNodeRef`.
- Accepts `SpatialNavigationNodeDefaultProps` plus either a focusable render-prop child or a non-focusable child.

### <a id="spatialnavigationvirtualizedlist"></a>SpatialNavigationVirtualizedList

Virtualized list integrated with spatial navigation.

- Exposes `focus(index)` and `scrollTo(index)` through `SpatialNavigationVirtualizedListRef`.
- Tracks `currentlyFocusedItemIndex` on the ref for consumers coordinating external state.

### <a id="spatialnavigationvirtualizedgrid"></a>SpatialNavigationVirtualizedGrid

Virtualized grid variant exposing the same ref API as the list.

### DefaultFocus

Marks a node as initially focused inside a subtree when the root activates.

### SpatialNavigationDeviceTypeProvider

Provider that detects whether the current interaction mode is pointer or remote-oriented and adapts focus behavior accordingly.
