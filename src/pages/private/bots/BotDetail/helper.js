import { themeObject } from '../../../../styles/themes/themeVariables';

export const getThemeConfig = (typeTheme) => ({
	components: {
		Input: {
			controlHeight: 60,
			fontSize: 16,
		},
		Select: {
			controlHeight: 36,
			fontSize: 16,
			controlHeightSM: 40,
			colorSplit: themeObject[typeTheme].inputBg,
		},
		Checkbox: {
			controlHeight: 24,
			colorPrimary: themeObject[typeTheme].colorRadioPrimary,
			colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
		},
		Radio: {
			controlHeight: 24,
			colorPrimary: themeObject[typeTheme].colorRadioPrimary,
			colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
		},
		Switch: {
			controlHeight: 24,
			colorPrimary: themeObject[typeTheme].colorRadioPrimary,
			colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
			colorBgContainer: '#FFFFFF',
			switchBg: '#FFFFFF',
			colorTextBase: themeObject[typeTheme].colorRadioPrimary,
		},
		Steps: {
			controlHeight: 35,
			colorPrimary: themeObject[typeTheme].colorRadioPrimary,
			colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
		},
		Segmented: {
			itemColor: themeObject[typeTheme].segmentedTextColor,
		},
	},
});

export const TICKER_FILTER_TYPE = {
	FIXED: 'fixed',
	DYNAMIC: 'dynamic',
};

export const PERIOD_LIST = [
	{
		label: '1 day',
		value: 'daily',
	},
	{
		label: '1 week',
		value: 'weekly',
	},
	{
		label: '1 month',
		value: 'monthly',
	},
	{
		label: '1 year',
		value: 'yearly',
	},
];

export const STRATEGY_TYPE = [
	{ label: 'Long', value: 'LONG' },
	{ label: 'Short', value: 'SHORT' },
];

export const LEVERAGE_TYPE = [
	{ label: 'Cross', value: 'cross' },
	{ label: 'Isolated', value: 'isolated' },
];
