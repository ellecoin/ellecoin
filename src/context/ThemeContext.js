import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { ConfigProvider } from 'antd';
import * as G2 from '@antv/g2';
import { useStore } from './AppContext';

import { themeObject } from '../styles/themes/themeVariables';
import { FONT_FAMILY } from '../styles/themes/constants';
import { chartDarkTheme } from '../styles/themes/dark/chartDarkTheme';
import { chartLightTheme } from '../styles/themes/light/chartLightTheme';
import { layoutStorage, localstorageTypes } from '../utils/localstorage';

export const defaultTheme = 'dark';
export const defaultCollapsed = layoutStorage.get(localstorageTypes.collapsedLayout);

export const ThemeContext = createContext();

const ThemeContextProvider = (props) => {
	const [siteConfig, setSiteConfig] = useState(null);
	const [typeTheme, setTypeTheme] = useState(defaultTheme);
	const [collapsed, setCollapsed] = useState(defaultCollapsed);
	const root = useRef(document.querySelector(':root'));
	const { registerTheme } = G2;
	registerTheme('dark', chartDarkTheme);
	registerTheme('light', chartLightTheme);
	const themeConfig = {
		token: {
			// Color
			colorPrimary: themeObject[typeTheme].primary,
			colorError: themeObject[typeTheme].error,
			colorInfo: themeObject[typeTheme].primary,
			colorSuccess: themeObject[typeTheme].success,
			colorWarning: themeObject[typeTheme].warning,
			colorTextBase: themeObject[typeTheme].colorTextBase,
			colorBgBase: themeObject[typeTheme].background,

			// Font
			fontFamily: FONT_FAMILY.main,
			fontSize: 16,
			fontWeight: 400,
			// Radius
			borderRadius: 12,
			// Size
			sizeUnit: 4,
			sizeStep: 4,
			sizePopupArrow: 16,
			// Control Base
			// controlHeight: 60,

			// map token
			colorBgLayout: themeObject[typeTheme].background,
			boxShadow: 'none',
			colorBgElevated: themeObject[typeTheme].backgroundElevated,
			colorTextSecondary: themeObject[typeTheme].colorTextBase,

			// alias token
			controlItemBgActive: themeObject[typeTheme].backgroundActivate,
			colorLink: themeObject[typeTheme].colorLinkPrimary,
			colorLinkActive: themeObject[typeTheme].colorLinkPrimary,
			colorLinkHover: themeObject[typeTheme].colorLinkPrimary,
		},
		components: {
			Input: {
				controlHeight: 60,
				fontSize: 16,
				borderRadius: 60,
				boxShadow: themeObject[typeTheme].inputBoxShadow,
				controlOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorBorderHover: themeObject[typeTheme].inputBoxShadow,
				colorErrorHover: themeObject[typeTheme].inputBoxShadow,
				colorBgContainer: themeObject[typeTheme].inputBg,
				colorBgContainerDisabled: themeObject[typeTheme].inputBg,
				controlItemBgActive: themeObject[typeTheme].backgroundActivate,
				colorTextPlaceholder: themeObject[typeTheme].colorTextPlaceholder,
				colorTextQuaternary: themeObject[typeTheme].colorIconInput,
				colorTextDisabled: themeObject[typeTheme].colorTextBase,
				colorBorder: themeObject[typeTheme].borderColor,
				colorBorderSecondary: themeObject[typeTheme].borderColor,
				colorPrimaryBorder: themeObject[typeTheme].borderColor,
				colorIcon: themeObject[typeTheme].colorIconInput,
				colorIconHover: themeObject[typeTheme].colorIconInput,
			},
			InputNumber: {
				controlHeight: 60,
				fontSize: 16,
				borderRadius: 60,
				boxShadow: themeObject[typeTheme].inputBoxShadow,
				controlOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorBorderHover: themeObject[typeTheme].inputBoxShadow,
				colorErrorHover: themeObject[typeTheme].inputBoxShadow,
				colorBgContainer: themeObject[typeTheme].inputBg,
				colorBgContainerDisabled: themeObject[typeTheme].inputBg,
				controlItemBgActive: themeObject[typeTheme].backgroundActivate,
				colorTextPlaceholder: themeObject[typeTheme].colorTextPlaceholder,
				colorTextQuaternary: themeObject[typeTheme].colorIconInput,
				colorTextDisabled: themeObject[typeTheme].colorTextBase,
				colorBorder: themeObject[typeTheme].borderColor,
				colorBorderSecondary: themeObject[typeTheme].borderColor,
				colorPrimaryBorder: themeObject[typeTheme].borderColor,
				colorIcon: themeObject[typeTheme].colorIconInput,
				colorIconHover: themeObject[typeTheme].colorIconInput,
			},
			Select: {
				borderRadius: 60,
				controlHeight: 60,
				boxShadow: themeObject[typeTheme].inputBoxShadow,
				controlOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorBorderHover: themeObject[typeTheme].inputBoxShadow,
				colorErrorHover: themeObject[typeTheme].inputBoxShadow,
				colorBgContainer: themeObject[typeTheme].inputBg,
				colorBgContainerDisabled: themeObject[typeTheme].inputBg,
				colorTextPlaceholder: themeObject[typeTheme].colorTextPlaceholder,
				colorTextQuaternary: themeObject[typeTheme].colorIconInput,
				colorTextDisabled: themeObject[typeTheme].colorTextBase,
				colorBorder: themeObject[typeTheme].borderColor,
				colorBorderSecondary: themeObject[typeTheme].borderColor,
				colorPrimaryBorder: themeObject[typeTheme].borderColor,
				colorIcon: themeObject[typeTheme].colorIconInput,
				colorIconHover: themeObject[typeTheme].colorIconInput,
			},
			DatePicker: {
				borderRadius: 60,
				controlHeight: 60,
				fontSize: 16,
				boxShadow: themeObject[typeTheme].inputBoxShadow,
				controlOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorOutline: themeObject[typeTheme].inputBoxShadow,
				colorErrorBorderHover: themeObject[typeTheme].inputBoxShadow,
				colorErrorHover: themeObject[typeTheme].inputBoxShadow,
				colorBgContainer: themeObject[typeTheme].inputBg,
				colorBgContainerDisabled: themeObject[typeTheme].inputBg,
				colorTextPlaceholder: themeObject[typeTheme].colorTextPlaceholder,
				colorTextQuaternary: themeObject[typeTheme].colorIconInput,
				colorTextDisabled: themeObject[typeTheme].colorIconInput,
				colorBorder: themeObject[typeTheme].borderColor,
				colorIcon: themeObject[typeTheme].colorIconInput,
				colorIconHover: themeObject[typeTheme].colorIconInput,
				cellHoverWithRangeBg: themeObject[typeTheme].backgroundActivate,
				cellRangeBorderColor: themeObject[typeTheme].inputBorderColorPrimary,
			},
			Radio: {
				colorPrimary: themeObject[typeTheme].secondary,
				borderRadius: 4,
				controlHeight: 60,
				colorBorder: themeObject[typeTheme].colorBorderRadio,
				colorPrimaryActive: themeObject[typeTheme].secondary,
				colorPrimaryHover: themeObject[typeTheme].secondary,
				colorBgContainer: themeObject[typeTheme].colorBgRadio,
			},
			Checkbox: {
				colorPrimary: themeObject[typeTheme].secondary,
				colorPrimaryHover: themeObject[typeTheme].secondary,
				colorPrimaryActive: themeObject[typeTheme].secondary,
				borderRadius: 4,
				controlHeight: 24,
				controlInteractiveSize: 24,
				colorBorder: themeObject[typeTheme].colorBorderCheckBox,
				colorBgContainer: themeObject[typeTheme].colorBgCheckBox,
			},
			Table: {
				rowSelectedBg: themeObject[typeTheme].rowSelectedBg,
				rowSelectedHoverBg: themeObject[typeTheme].rowSelectedBg,
				colorBgContainer: themeObject[typeTheme].colorBgTable,
				colorBgElevated: themeObject[typeTheme].colorBgTable,
				colorBgLayout: themeObject[typeTheme].colorBgTable,
				colorPrimaryBg: themeObject[typeTheme].colorBgTable,
				controlItemBgActive: themeObject[typeTheme].colorBgTable,
				controlItemBgHover: themeObject[typeTheme].colorBgTable,
				colorBgSpotlight: themeObject[typeTheme].colorBgTable,
				tableHeaderBg: themeObject[typeTheme].colorBgTable,
				colorTextDisabled: themeObject[typeTheme].colorTextDisabledTable,
				colorBorderSecondary: themeObject[typeTheme].borderColorSecondary,
				borderRadiusLG: 0,
				colorPrimary: themeObject[typeTheme].colorTextBase,
			},
			Tabs: {
				colorBgContainer: themeObject[typeTheme].cardPrimaryColor,
				colorBgElevated: themeObject[typeTheme].cardPrimaryColor,
				colorBgLayout: themeObject[typeTheme].cardPrimaryColor,
				colorPrimaryBg: themeObject[typeTheme].cardPrimaryColor,
				controlItemBgActive: themeObject[typeTheme].cardPrimaryColor,
				controlItemBgHover: themeObject[typeTheme].cardPrimaryColor,
				colorBgSpotlight: themeObject[typeTheme].cardPrimaryColor,
				colorBorderSecondary: themeObject[typeTheme].borderColorSecondary,
				borderRadiusLG: 0,
				colorPrimary: themeObject[typeTheme].colorTabsPrimary,
				colorPrimaryHover: themeObject[typeTheme].colorTabsPrimary,
				fontSize: 14,
				fontSizeLG: 14,
			},
			Divider: {
				colorSplit: themeObject[typeTheme].colorDivide,
			},
			Pagination: {
				borderRadius: 8,
				controlHeight: 32,
				colorBgContainer: themeObject[typeTheme].paginationItemColorPrimary,
				colorBgTextActive: themeObject[typeTheme].paginationItemColorPrimary,
				colorBgTextHover: themeObject[typeTheme].paginationItemColorPrimary,
				colorText: themeObject[typeTheme].paginationTextColorSecondary,
				colorTextDisabled: themeObject[typeTheme].paginationTextColorSecondary,
				colorTextPlaceholder: themeObject[typeTheme].paginationTextColorSecondary,
				colorBorder: 'none',
				colorPrimary: 'none',
				colorPrimaryBorder: 'none',
				colorPrimaryHover: 'none',
				fontSize: 12,
				fontSizeLG: 12,
				fontWeightStrong: 600,
			},
			Tooltip: {
				fontSize: 14,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgSpotlight: themeObject[typeTheme].colorBgDropdown,
				colorText: themeObject[typeTheme].textPrimary,
			},
			Modal: {
				headerBg: themeObject[typeTheme].headerBgModal,
			},
		},
	};

	const changeTheme = (theme) => {
		setTypeTheme(theme);
		localStorage.setItem('theme', theme);
	};

	const openSider = (collapsed) => {
		setCollapsed(collapsed);
		localStorage.setItem('collapsed', collapsed);
	};

	const theme_context = useMemo(
		() => ({
			siteConfig,
			changeTheme,
			typeTheme,
			collapsed,
			openSider,
		}),
		[siteConfig, changeTheme, typeTheme, collapsed, openSider]
	);

	useEffect(() => {
		layoutStorage.set(localstorageTypes.collapsedLayout, collapsed);
	}, [collapsed]);

	useEffect(() => {
		const html = root.current;
		if (html) {
			html.setAttribute('data-no-transition', '');
			html.setAttribute('data-theme', typeTheme);
			// remove transition after layout update
			requestAnimationFrame(() => {
				html.removeAttribute('data-no-transition');
			});
		}
	}, [typeTheme]);

	return (
		<ThemeContext.Provider value={theme_context}>
			<ConfigProvider theme={themeConfig}>{props.children}</ConfigProvider>
		</ThemeContext.Provider>
	);
};

export default ThemeContextProvider;
