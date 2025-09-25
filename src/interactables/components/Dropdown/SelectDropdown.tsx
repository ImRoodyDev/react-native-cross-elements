import React, {ComponentRef, Ref, useCallback, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {ColorValue, FlatList, ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {isExist} from '../../../utils/isExist';
import Input from './Input';
import DropdownOverlay from './DropdownOverlay';
import DropdownModal from './DropdownModal';
import {useSelectDropdown} from '../../hooks/useSelectDropdown';
import {useLayoutDropdown} from '../../hooks/useLayoutDropdown';
import {findIndexInArr} from '../../utils/findIndexInArr';
import {mountedPortalProviders} from '../../controllers/portalRegistry';
import {Portal} from '../Portal/Portal';
import {SpatialNavigationNode, SpatialNavigationRoot, SpatialNavigationView} from '../../../navigation';
import DropdownWindow from './DropdownWindow';
import {SelectDropdownProps, SelectDropdownRef} from '../../types/Dropdown';
import {typedForwardRef} from '../../../utils/TypedForwardRef';
import {useSpatialNavigatorExist} from "../../../navigation/context/SpatialNavigatorContext";

export const Dropdown = typedForwardRef(<T, >(props: SelectDropdownProps<T>, ref?: Ref<SelectDropdownRef>) => {
	const {
		data,
		onSelect,
		onDropdownWillShow,
		defaultValue,
		defaultValueByIndex,
		disabled = false,
		disabledIndexes,
		disableAutoScroll,
		testID,
		onFocus,
		onBlur,
		onScrollEndReached,
		// Dropdown
		dropDownSpacing,
		dropdownStyle,
		statusBarTranslucent,
		dropdownOverlayColor,
		showsVerticalScrollIndicator,
		animateDropdown = true,
		springConfig,
		animationConfig,
		animationType = 'spring',
		// Search
		search,
		searchInputStyle,
		searchInputTxtColor,
		searchInputTxtStyle,
		searchPlaceHolder,
		searchPlaceHolderColor,
		renderSearchInputLeftIcon,
		renderSearchInputRightIcon,
		onChangeSearchInputText,
		// Custom render
		renderButton,
		renderButtonContent,
		renderItemButton,
		renderItemContent,
	} = props;

	// Spatial navigation context
	const spatialNavigatorExist = useSpatialNavigatorExist();

	// Disable internal search if custom search handler is passed
	const disabledInternalSearch = !!onChangeSearchInputText;

	// Internal refs for button & list
	const dropdownButtonRef = useRef<ComponentRef<typeof TouchableOpacity>>(null);
	const dropDownFlatListRef = useRef<FlatList>(null);
	const [focused, setFocused] = useState(false);

	// Layout & visibility handling
	const {
		isVisible,
		setDropdownVisible,
		buttonLayout,
		onDropdownButtonLayout,
		animatedDropdownStyle,
		onRequestClose
	} = useLayoutDropdown<T>({
		data,
		dropdownStyle,
		animateDropdown,
		animationConfig,
		springConfig,
		animationType,
		dropDownSpacing
	});

	// Dropdown state and item selection logic
	const {dataArr, selectedItem, selectItem, reset, searchTxt, setSearchTxt} = useSelectDropdown<T>(data, defaultValueByIndex, defaultValue, disabledInternalSearch);

	/**
	 * Scroll list to currently selected item
	 */
	const scrollToSelectedItem = useCallback(() => {
		const indexInCurrArr = findIndexInArr(selectedItem, dataArr);
		setTimeout(() => {
			if (disableAutoScroll) return;
			if (indexInCurrArr > 1) {
				dropDownFlatListRef.current?.scrollToIndex({
					index: search ? indexInCurrArr - 1 : indexInCurrArr,
					animated: true,
				});
			}
		}, 200);
	}, [selectedItem, dataArr, disableAutoScroll, search]);

	/**
	 * Open dropdown: measure button, set layout, show modal
	 */
	const openDropdown = useCallback(() => {
		onDropdownWillShow?.(true);
		dropdownButtonRef.current?.measure?.((_, __, w, h, px, py) => {
			onDropdownButtonLayout(w, h, px, py);
			setDropdownVisible(true);
			onFocus?.();
			scrollToSelectedItem();
		});
	}, [onDropdownWillShow, dropdownButtonRef, onDropdownButtonLayout, onFocus, scrollToSelectedItem]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Close dropdown and reset search
	 */
	const closeDropdown = useCallback(() => {
		setDropdownVisible(false);
		onDropdownWillShow?.(false);
		setSearchTxt('');
		onBlur?.();
	}, [onDropdownWillShow, setSearchTxt, onBlur]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Handle selecting an item
	 */
	const onSelectItem = useCallback((item: T) => {
		const indexInOriginalArr = findIndexInArr(item, data);
		closeDropdown();
		onSelect?.(item, indexInOriginalArr);
		selectItem(indexInOriginalArr);
	}, [closeDropdown, onSelect, data, selectItem]);

	/**
	 * Handle scroll-to-index failure (e.g., item not rendered yet)
	 */
	const onScrollToIndexFailed = useCallback((error: { averageItemLength: number; index: number }) => {
		dropDownFlatListRef.current?.scrollToOffset({
			offset: error.averageItemLength * error.index,
			animated: true,
		});
		setTimeout(() => {
			if (dataArr.length !== 0 && dropDownFlatListRef.current) {
				dropDownFlatListRef.current.scrollToIndex({
					index: error.index,
					animated: true,
				});
			}
		}, 100);
	}, [dataArr]);

	/**
	 * Toggle dropdown
	 */
	const onToggleDropdown = useCallback(() => {
		if (isVisible) closeDropdown();
		else openDropdown();
	}, [isVisible, closeDropdown, openDropdown]);

	const handleFocus = useCallback(() => {
		setFocused(true);
	}, []);
	const handleBlur = useCallback(() => {
		setFocused(false);
	}, []);

	/**
	 * Render the search input view if enabled
	 */
	const renderSearchView = useCallback(() => {
		if (!search) return null;

		return (
			<Input
				searchViewWidth={buttonLayout.w}
				value={searchTxt}
				valueColor={searchInputTxtColor}
				placeholder={searchPlaceHolder}
				placeholderTextColor={searchPlaceHolderColor}
				onChangeText={(txt: string) => {
					setSearchTxt(txt);
					if (disabledInternalSearch) {
						onChangeSearchInputText?.(txt);
					}
				}}
				inputStyle={searchInputStyle}
				inputTextStyle={searchInputTxtStyle}
				renderLeft={renderSearchInputLeftIcon}
				renderRight={renderSearchInputRightIcon}
			/>
		);
	}, [
		search,
		buttonLayout.w,
		searchTxt,
		searchInputTxtColor,
		searchPlaceHolder,
		searchPlaceHolderColor,
		setSearchTxt,
		disabledInternalSearch,
		onChangeSearchInputText,
		searchInputStyle,
		searchInputTxtStyle,
		renderSearchInputLeftIcon,
		renderSearchInputRightIcon,
	]);

	/**
	 * Render a single dropdown item
	 */
	const renderFlatListItem = useCallback(({item, index}: ListRenderItemInfo<T>) => {
		const indexInCurrArr = findIndexInArr(selectedItem, dataArr);
		const isSelected = index === indexInCurrArr;
		if (!isExist(item)) return null;

		// Fully custom item button
		if (renderItemButton) {
			return renderItemButton({
				item,
				index,
				isSelected,
				disabled: disabledIndexes?.includes(index),
				onPress: () => onSelectItem(item),
			});
		}

		// Default item touchable
		const innerItemComponents = (renderItemContent ?
				renderItemContent(item, index, isSelected)
				:
				<Text selectable={false} style={[Styles.dropdownItemButtonText, isSelected && Styles.dropdownItemButtonTextSelected]}>
					{typeof item === 'string' || typeof item === 'number' ? item : JSON.stringify(item)}
				</Text>
		);


		const itemButton = (
			<TouchableOpacity
				{...(renderItemContent != undefined && innerItemComponents.props)} // Able to pass key index
				disabled={disabledIndexes?.includes(index)}
				activeOpacity={0.8}
				onPress={() => onSelectItem(item)}
			>
				{
					// Handle cases when user pass a component which dont have children props
					renderItemContent != undefined ? innerItemComponents.props?.children ?? innerItemComponents : innerItemComponents
				}
			</TouchableOpacity>
		);

		if (!spatialNavigatorExist)
			return itemButton;
		else
			return (
				<SpatialNavigationNode isFocusable key={index} onSelect={() => onSelectItem(item)}>
					{() => itemButton}
				</SpatialNavigationNode>
			);
	}, [spatialNavigatorExist, dataArr, selectedItem, renderItemButton, renderItemContent, disabledIndexes, onSelectItem]);

	// OPTIMIZATION 1: Extract FlatList with cleaner memoization
	const renderDropdownFlatList = useMemo(() => {
		return <FlatList
			testID={testID}
			data={dataArr}
			keyExtractor={(_, index) => index.toString()}
			ref={dropDownFlatListRef}
			renderItem={renderFlatListItem}
			ListHeaderComponent={renderSearchView()}
			stickyHeaderIndices={search ? [0] : undefined}
			keyboardShouldPersistTaps="always"
			onEndReached={() => onScrollEndReached?.()}
			onEndReachedThreshold={0.5}
			showsVerticalScrollIndicator={showsVerticalScrollIndicator}
			showsHorizontalScrollIndicator={false}
			onScrollToIndexFailed={onScrollToIndexFailed}
		/>
	}, [
		testID,
		dataArr,
		renderFlatListItem,
		renderSearchView,
		search,
		onScrollEndReached,
		showsVerticalScrollIndicator,
		onScrollToIndexFailed,
	]);

	// OPTIMIZATION 2: Simplified dropdown window - remove conditional nesting
	const renderDropdownWindow = useMemo(() => {
		return <>
			<DropdownOverlay onPress={closeDropdown} backgroundColor={dropdownOverlayColor as ColorValue}/>
			<DropdownWindow layoutStyle={animatedDropdownStyle}>
				{
					spatialNavigatorExist ?
						<SpatialNavigationView alignInGrid={true} direction="vertical" style={{height: '100%', width: '100%'}}>
							{renderDropdownFlatList}
						</SpatialNavigationView>
						:
						renderDropdownFlatList
				}
			</DropdownWindow>
		</>
	}, [renderDropdownFlatList, spatialNavigatorExist, closeDropdown, dropdownOverlayColor, animatedDropdownStyle])

	/**
	 * Render dropdown window or portal (memoized for performance)
	 */
	const renderDropdown = useMemo(() => {
		if (!isVisible) return null;

		const dropdownContent = spatialNavigatorExist ? (
			<SpatialNavigationRoot isActive={true}>
				{renderDropdownWindow}
			</SpatialNavigationRoot>
		) : renderDropdownWindow;


		// Check if a Portal is present
		const portalMounted = mountedPortalProviders() > 0;
		return portalMounted ? (
			<Portal>
				<View style={[StyleSheet.absoluteFill, {pointerEvents: 'auto'}]}>
					{dropdownContent}
				</View>
			</Portal>
		) : (
			<DropdownModal statusBarTranslucent={statusBarTranslucent} visible={isVisible} onRequestClose={onRequestClose}>
				{dropdownContent}
			</DropdownModal>
		);
	}, [
		isVisible,
		spatialNavigatorExist,
		renderDropdownWindow,
		statusBarTranslucent,
		onRequestClose,
	]);

	/**
	 * Expose public methods to parent via ref
	 */
	useImperativeHandle(
		ref,
		() => ({
			reset,
			openDropdown,
			closeDropdown,
			selectIndex: selectItem,
		}),
		[reset, openDropdown, closeDropdown, selectItem]
	);

	/**
	 * Render the main button that toggles dropdown
	 */
	if (renderButton) {
		const element = renderButton({selectedItem, isVisible, disabled, onPress: onToggleDropdown});
		const clonedElement = React.cloneElement(element, {ref: dropdownButtonRef});
		return <React.Fragment>
			{clonedElement}
			{renderDropdown}
		</React.Fragment>;
	} else {
		// Inner button content only (no touchable)
		const innerDropdownComponents = (renderButtonContent ?
			renderButtonContent(selectedItem, isVisible, focused)
			: typeof selectedItem === 'string' || typeof selectedItem === 'number' ?
				<Text selectable={false} style={Styles.dropdownButton}>{selectedItem}</Text> : <View/>);

		// Extract props form the inner component to pass to touchable
		const {
			style = Styles.dropdownButton,
			...dropdownProps
		} = innerDropdownComponents.props ?? {};

		// Main touchable button
		const dropdownButtonComponent = <TouchableOpacity
			{...dropdownProps}
			style={style}
			ref={dropdownButtonRef}
			activeOpacity={0.8}
			disabled={disabled}
			onPress={onToggleDropdown}
		>
			{innerDropdownComponents}
		</TouchableOpacity>

		if (!spatialNavigatorExist)
			return <React.Fragment>
				{dropdownButtonComponent}
				{renderDropdown}
			</React.Fragment>;
		else
			return (
				<React.Fragment>
					<SpatialNavigationNode isFocusable onFocus={handleFocus} onBlur={handleBlur} onSelect={onToggleDropdown}>
						{() => dropdownButtonComponent}
					</SpatialNavigationNode>
					{renderDropdown}
				</React.Fragment>
			);
	}
});

const Styles = StyleSheet.create({
	dropdownButton: {
		backgroundColor: 'white',
		paddingHorizontal: 20,
		paddingVertical: 12,
		borderRadius: 9999999,
	},
	dropdownButtonText: {
		fontSize: 16,
		color: 'black',
	},
	dropdownItemButton: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',

		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	dropdownItemButtonText: {
		fontSize: 14,
		color: 'black',
	},
	dropdownItemButtonTextSelected: {
		fontWeight: 'bold',
	},
});