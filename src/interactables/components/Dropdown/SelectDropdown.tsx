import React, {ComponentRef, Ref, useCallback, useImperativeHandle, useMemo, useRef, useState} from 'react';
import {ColorValue, FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity, View} from 'react-native';
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
		disabled,
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
	const onSelectItem = useCallback(
		(item: T) => {
			const indexInOriginalArr = findIndexInArr(item, data);
			closeDropdown();
			onSelect?.(item, indexInOriginalArr);
			selectItem(indexInOriginalArr);
		},
		[closeDropdown, onSelect, data, selectItem]
	);

	/**
	 * Handle scroll-to-index failure (e.g., item not rendered yet)
	 */
	const onScrollToIndexFailed = useCallback(
		(error: { averageItemLength: number; index: number }) => {
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
		},
		[dataArr]
	);

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
	const renderFlatListItem = useCallback(
		({item, index}: ListRenderItemInfo<T>) => {
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
			const clonedElement = renderItemContent ? renderItemContent(item, index, isSelected) : <View/>;

			const itemButton = (
				<TouchableOpacity
					{...clonedElement?.props} // Able to pass key index
					disabled={disabledIndexes?.includes(index)}
					activeOpacity={0.8}
					onPress={() => onSelectItem(item)}
				>
					{
						// Hamdle cases when user pass a component which dont have children props
						clonedElement.props?.children || clonedElement
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
		},
		[spatialNavigatorExist, dataArr, selectedItem, renderItemButton, renderItemContent, disabledIndexes, onSelectItem]
	);

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
		return React.cloneElement(element, {ref: dropdownButtonRef});
	} else {
		const clonedDropdownElement = renderButtonContent ? renderButtonContent(selectedItem, isVisible, focused) : <View/>;
		const dropdownProps = {...clonedDropdownElement.props};

		const buttonComponent = <TouchableOpacity {...dropdownProps} ref={dropdownButtonRef} activeOpacity={0.8} disabled={disabled} onPress={onToggleDropdown}>
			{clonedDropdownElement}
		</TouchableOpacity>

		if (!spatialNavigatorExist)
			return <React.Fragment>
				{buttonComponent}
				{renderDropdown}
			</React.Fragment>;
		else
			return (
				<React.Fragment>
					<SpatialNavigationNode isFocusable onFocus={handleFocus} onBlur={handleBlur} onSelect={onToggleDropdown}>
						{() => (
							<TouchableOpacity {...dropdownProps} ref={dropdownButtonRef} activeOpacity={0.8} disabled={disabled} onPress={onToggleDropdown}>
								{clonedDropdownElement}
							</TouchableOpacity>
						)}
					</SpatialNavigationNode>
					{renderDropdown}
				</React.Fragment>
			);
	}
});