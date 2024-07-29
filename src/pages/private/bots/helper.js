import { themeObject } from '../../../styles/themes/themeVariables';
import { BASE_COLORS } from '../../../styles/themes/constants';
import { BOT_STATUS_LIST } from '../../../constants/bot';

export const FORM_STEP = [
	{ title: 'bot_basic_info', key: '1' },
	{ title: 'config_ticker', key: '2' },
];

export const TICKER_FILTER_TYPE = {
	FIXED: 'fixed',
	DYNAMIC: 'dynamic',
};

export const initFormValues = {
	// test_mode: false,
	pair_with: 'USDT',
	quantity: 15,
	max_coins: 15,
	investment: 250,
	base_order_amount: 15,
	time_interval: 30,
	number_of_sample: 10,
	change_in_price: 2,
	stop_loss_percentage: 15,
	take_profit_percentage: 3,
	avg_trend_daily: 50,
	num_top_coin: 2,
	btc_ma_sell: 7,
	use_traling_stoploss: true,
	trailing_stop_loss: 0.4,
	trailing_take_profit: 0.1,
	use_target_total_profit: true,
	target_total_profit: 30,
	use_allowed_total_loss: true,
	allowed_total_loss: 30,
	use_time_cooldown: false,
	time_cooldown: 1800,
	use_time_close_deal: false,
	time_close_deal: 604800,
	whitelist_ticker_info: {
		type: 1,
		filter_type: 'fixed',
	},
	blacklist_ticker_info: {
		type: 1,
		filter_type: 'fixed',
	},
	take_profit_dynamic: [{ field: 'safety', negate: false, operator: 'gt', value: '75' }], // default safety > 75
	use_minimum_profit: true,
	minimum_profit_percentage: 1,
	leverage: 1,
	leverage_type: 'cross',
	strategy: 'LONG',
};

export const BOT_ACTION = {
	CREATE: 'create',
	UPDATE: 'update',
	COPY: 'copy',
	DUPLICATE: 'duplicate',
};

export const isNull = (value = null) => Object.is(value, null);

export const getThemeConfig = (typeTheme) => ({
	components: {
		Input: {
			controlHeight: 60,
			fontSize: 16,
		},
		Select: {
			controlHeight: 60,
			fontSize: 16,
			controlHeightSM: 40,
			colorSplit: themeObject[typeTheme].inputBg,
			colorFillSecondary: themeObject[typeTheme].colorBgSelectItem,
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
			colorTextBase: themeObject[typeTheme].colorRadioPrimary,
		},
		Steps: {
			controlHeight: 35,
			colorPrimary: themeObject[typeTheme].colorRadioPrimary,
			colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
			colorTextDescription: themeObject[typeTheme].colorTextStepsDisable,
			colorTextLabel: themeObject[typeTheme].colorTextStepsDisable,
			colorFillContent: themeObject[typeTheme].colorBgStepsDisable,
			colorText: themeObject[typeTheme].textPrimary,
			colorSplit: themeObject[typeTheme].colorStepsLine,
			colorBorderBg: themeObject[typeTheme].colorBorderStepsDisable,
			colorTextLightSolid: BASE_COLORS.white,
			fontSize: 14,
			fontSizeLG: 14,
		},
	},
});

export const TICKER_TYPE = [
	{
		label: 'all',
		value: undefined,
	},
	{
		label: 'fixed',
		value: 'fixed',
	},
	{
		label: 'dynamic',
		value: 'dynamic',
	},
];

export const STRATEGY = [
	{
		label: 'all',
		value: undefined,
	},
	{
		label: 'Long',
		value: 'LONG',
	},
	{
		label: 'Short',
		value: 'SHORT',
	},
];

export const matchBotStatusLabel = (status) => {
	switch (status) {
		case BOT_STATUS_LIST.on:
			return { label: 'bot_running', bgColor: '#009120' };
		case BOT_STATUS_LIST.pause:
			return { label: 'paused', bgColor: '#FFB800' };
		case BOT_STATUS_LIST.off:
			return { label: 'stopped', bgColor: '#EE2E2C' };
		case BOT_STATUS_LIST.created:
			return { label: 'created', bgColor: '#5D6589' };
		case BOT_STATUS_LIST.deleted:
			return { label: 'deleted', bgColor: '#EE2E2C' };

		default:
			return { label: '' };
	}
};
