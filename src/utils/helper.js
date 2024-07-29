import { measureTextWidth } from '@antv/g2plot/lib/utils/measure-text';
import dayjs from 'dayjs';
import React from 'react';
import localeEN from 'antd/es/date-picker/locale/en_US';
import localeES from 'antd/es/date-picker/locale/es_ES';
import localePT from 'antd/es/date-picker/locale/pt_BR';
import localeVN from 'antd/es/date-picker/locale/vi_VN';

const localeESCustom = {
	...localeES,
	lang: {
		...localeES.lang,
		shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		shortWeekDays: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
	},
};
const tvSupportedTimezones = [
	'Etc/UTC',
	'Africa/Cairo',
	'Africa/Casablanca',
	'Africa/Johannesburg',
	'Africa/Lagos',
	'America/Anchorage',
	'America/Argentina/Buenos_Aires',
	'America/Bogota',
	'America/Caracas',
	'America/Chicago',
	'America/El_Salvador',
	'America/Juneau',
	'America/Lima',
	'America/Los_Angeles',
	'America/Mexico_City',
	'America/New_York',
	'America/Phoenix',
	'America/Santiago',
	'America/Sao_Paulo',
	'America/Toronto',
	'America/Vancouver',
	'Asia/Almaty',
	'Asia/Ashkhabad',
	'Asia/Bahrain',
	'Asia/Bangkok',
	'Asia/Chongqing',
	'Asia/Colombo',
	'Asia/Dubai',
	'Asia/Ho_Chi_Minh',
	'Asia/Hong_Kong',
	'Asia/Jakarta',
	'Asia/Jerusalem',
	'Asia/Karachi',
	'Asia/Kathmandu',
	'Asia/Kolkata',
	'Asia/Kuwait',
	'Asia/Manila',
	'Asia/Muscat',
	'Asia/Nicosia',
	'Asia/Qatar',
	'Asia/Riyadh',
	'Asia/Yangon',
	'Asia/Seoul',
	'Asia/Shanghai',
	'Asia/Singapore',
	'Asia/Taipei',
	'Asia/Tehran',
	'Asia/Tokyo',
	'Atlantic/Reykjavik',
	'Australia/Adelaide',
	'Australia/Brisbane',
	'Australia/Perth',
	'Australia/Sydney',
	'Europe/Athens',
	'Europe/Belgrade',
	'Europe/Berlin',
	'Europe/Bratislava',
	'Europe/Brussels',
	'Europe/Bucharest',
	'Europe/Budapest',
	'Europe/Copenhagen',
	'Europe/Helsinki',
	'Europe/Istanbul',
	'Europe/London',
	'Europe/Luxembourg',
	'Europe/Madrid',
	'Europe/Moscow',
	'Europe/Oslo',
	'Europe/Paris',
	'Europe/Riga',
	'Europe/Rome',
	'Europe/Stockholm',
	'Europe/Tallinn',
	'Europe/Vilnius',
	'Europe/Warsaw',
	'Europe/Zurich',
	'Pacific/Auckland',
	'Pacific/Chatham',
	'Pacific/Fakaofo',
	'Pacific/Honolulu',
	'Pacific/Norfolk',
	'US/Mountain',
];
export const integratedExchanges = [
	{
		id: 'binance',
		code: 'binance',
		mode: 'future',
		name: 'Binance Future',
		referLink: 'https://accounts.binance.com/en/register?ref=BLEYE161',
	},
	{
		id: 'binance',
		code: 'binance',
		mode: 'spot',
		name: 'Binance',
		referLink: 'https://accounts.binance.com/en/register?ref=BLEYE161',
	},
	{
		id: 'mercado',
		code: 'mercado',
		mode: 'spot',
		name: 'Mercado Bitcoin',
		referLink:
			'https://conta.mercadobitcoin.com.br/cadastro?mgm_token=4ae55ab13a1b64056a4639f12b28d4ad01b896d9d7802c4681fa0f1c7de5b559&utm_campaign=mgm&utm_source=web&utm_medium=link-copy',
	},
	{
		id: 'gate',
		code: 'gate',
		mode: 'spot',
		name: 'Gate.io',
		referLink: 'https://www.gate.io/signup/11898212',
	},
	{
		id: 'kucoin',
		code: 'kucoin',
		name: 'KuCoin',
		mode: 'spot',
		referLink: 'https://www.kucoin.com/ucenter/signup?rcode=r3PFM64',
	},
	{
		id: 'huobi',
		code: 'huobi',
		name: 'Huobi',
		mode: 'spot',
		referLink: 'https://www.huobi.com/en-us/register',
	},
	{
		id: 'coinbase',
		code: 'coinbase',
		name: 'Coinbase',
		mode: 'spot',
		referLink: 'https://coinbase.com/join/silva_9h5',
	},
	{
		id: 'novadax',
		code: 'novadax',
		name: 'NovaDAX',
		mode: 'spot',
		referLink: 'https://novadax.info/nQhaipdjEbmLHoi79',
	},
	{
		id: 'hollaex',
		code: 'hollaex',
		name: 'HollaEx',
		mode: 'spot',
		referLink: 'https://dash.hollaex.com/signup',
	},
	{
		id: 'okx',
		code: 'okx',
		name: 'OKX',
		mode: 'spot',
		referLink: 'https://www.okx.com/join',
	},
	// { id: 'okx', code: 'okx', name: 'OKX', mode: 'future', referLink: 'https://www.okx.com/join' },
	{
		id: 'bybit',
		code: 'bybit',
		name: 'Bybit',
		mode: 'spot',
		referLink: 'https://www.bybit.com/en-US/sign-up',
	},
	{
		id: 'bingx',
		code: 'bingx',
		name: 'BingX',
		mode: 'spot',
		referLink: 'https://bingx.com/en-sa/',
	},
];

export const handleGetExchangeLogo = (exchange) => {
	const exchangeStr = exchange?.split(' ')[0]?.toLowerCase();
	switch (exchangeStr) {
		case 'mercado':
			return '/images/mercado_logo.svg';
		case 'binance':
			return '/images/binance_logo.svg';
		case 'ftx':
			return '/images/ftx_logo.svg';
		case 'gate':
			return '/images/gate_logo.png';
		case 'coinbase':
			return '/images/coinbase_logo.png';
		case 'huobi':
			return '/images/huobi_logo.png';
		case 'kucoin':
			return '/images/kucoin_logo.png';
		case 'novadax':
			return '/images/novadax_logo.png';
		case 'hollaex':
			return '/images/hollaex_logo.png';
		case 'okx':
			return '/images/okx_logo.png';
		case 'bybit':
			return '/images/bybit_logo.png';
		case 'bingx':
			return '/images/bingX.webp';
		default:
			return '';
	}
};
export const handleGetMarketChangeLogo = (isUp) => {
	switch (isUp) {
		case true:
			return '/images/market-change/market_up.svg';
		default:
			return '/images/market-change/market_down.svg';
	}
};

export const handleGetExchangeLargeLogo = (exchange) => {
	switch (exchange) {
		case 'mercado':
			return '/images/mercado_logo_large.png';
		case 'binance':
			return '/images/binance_logo_large.svg';
		case 'gate':
			return '/images/gate_logo_large.png';
		case 'coinbase':
			return '/images/coinbase_logo_large.svg';
		case 'huobi':
			return '/images/huobi_logo_large.png';
		case 'kucoin':
			return '/images/kucoin_logo_large.png';
		case 'novadax':
			return '/images/novadax_logo_large.webp';
		case 'hollaex':
			return '/images/hollaex_logo_large.webp';
		case 'okx':
			return '/images/okx_logo_large.png';
		case 'bybit':
			return '/images/bybit_logo_large.svg';
		case 'bingx':
			return '/images/bingx_logo.png';
		default:
			return '';
	}
};

export const getExchangeName = (exchange) => {
	switch (exchange) {
		case 'mercado':
			return 'Mercado Bitcoin';
		case 'binance':
			return 'Binance';
		case 'ftx':
			return 'FTX';
		case 'gate':
			return 'Gate.io';
		case 'coinbase':
			return 'Coinbase';
		case 'huobi':
			return 'Huobi';
		case 'kucoin':
			return 'KuCoin';
		case 'novadax':
			return 'NovaDAX';
		case 'hollaex':
			return 'HollaEx';
		case 'okx':
			return 'OKX';
		case 'bybit':
			return 'Bybit';
		case 'bingx':
			return 'BingX';
		default:
			return '-';
	}
};

export const getLanguageLabel = (language) => {
	switch (language) {
		case 'en':
			return 'English';
		case 'es':
			return 'Spanish';
		case 'vi':
			return 'Tiếng Việt';
		default:
			return 'Português';
	}
};

export const getMoneyFormat = (value) => {
	const formattedValue = `${value}`?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (formattedValue.split('.')[1]?.length === 1) {
		return `${formattedValue}0`;
	}
	return formattedValue;
};

export const getMoneyText = (value, currency) =>
	`${value < 0 ? '-' : ''}${currency === 'usd' ? '$' : 'R$'}${getMoneyFormat(Math.abs(value))}`;

export const getPNLText = (value, currency) =>
	`${value < 0 ? '-' : '+'}${currency === 'usd' ? '$' : 'R$'}${getMoneyFormat(Math.abs(value))}`;

export const getFearIndicatorColor = (value) => {
	let color = '#000000';
	switch (value) {
		case 'Extreme Fear':
			color = '#EE243A';
			break;
		case 'Fear':
			color = '#EF7B32';
			break;
		case 'Neutral':
			color = '#F3BA2F';
			break;
		case 'Greed':
			color = '#30E0A1';
			break;
		default:
			color = '#18E33A';
			break;
	}
	return color;
};

export const renderStatistic = (containerWidth, text, style, currentValue = '') => {
	const textWidth = measureTextWidth(text, style);
	let scale = 1;

	if (containerWidth < textWidth) {
		scale = (containerWidth - 20) / textWidth;
	}

	const currentValueElement = currentValue
		? `<div style="background-color: ${style.color}" class="${
				style?.typeTheme === 'dark' ? 'text-black' : 'text-white'
		  } inline-flex justify-center font-medium text-[14px] leading-[30px] greed-value-item">
		${currentValue || ''}
	</div> `
		: '';
	return `<div style="text-align:${style.textAlign};font-size:${scale * style.fontSize}px;color:${
		style.color
	};line-height:${scale < 1 ? 1 : 'inherit'};">${currentValueElement}${text}</div>`;
};

export const renderDateTimeTable = (timestamp) => {
	if (!timestamp) return '-';
	const dateFormat = dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
	return <p className="text-primary text-[14px]"> {dateFormat}</p>;
};

export const renderDateTable = (timestamp) => {
	const dateFormat = dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
	const date = dateFormat.split(' ')[0];
	return <p className="text-primary text-[14px]"> {date} </p>;
};

export const getLocaleDatePicker = (language) => {
	switch (language) {
		case 'en':
			return localeEN;
		case 'es':
			return localeESCustom;
		case 'vi':
			return localeVN;
		default:
			return localePT;
	}
};

export const getUniqueListBy = (arr, key) => [...new Map(arr?.map((item) => [item[key], item])).values()];

export const getIntervalDefaultByExchange = (exchangeCode) => {
	switch (exchangeCode) {
		case 'binance':
			return '1d';
		case 'coinbase':
			return 86400;
		case 'gate':
			return '1d';
		case 'hollaex':
			return '1D';
		case 'huobi':
			return '1day';
		case 'kucoin':
			return '1day';
		case 'mercado':
			return '1d';
		case 'novadax':
			return 'ONE_DAY';
		default:
			return '1d';
	}
};
const interval_mapping = {
	binance: {
		1: '1s',
		60: '1m',
		180: '3m',
		300: '5m',
		900: '15m',
		1800: '30m',
		3600: '1h',
		7200: '2h',
		14400: '4h',
		21600: '6h',
		28800: '8h',
		43200: '12h',
		86400: '1d',
		259200: '3d',
		604800: '1w',
		2419200: '1M',
	},
	coinbase: {
		60: '60',
		180: '180',
		300: '300',
		900: '900',
		3600: '3600',
		21600: '21600',
		86400: '86400',
	},
	gate: {
		10: '10s',
		60: '1m',
		300: '5m',
		900: '15m',
		1800: '30m',
		3600: '1h',
		14400: '4h',
		28800: '8h',
		86400: '1d',
		604800: '7d',
		2419200: '30d',
	},
	hollaex: {
		900: '15',
		3600: '60',
		14400: '240',
		86400: '1D',
		604800: '1W',
	},

	huobi: {
		60: '1min',
		300: '5min',
		900: '15min',
		1800: '30min',
		3600: '60min',
		14400: '4hour',
		86400: '1day',
		604800: '1week',
		2419200: '1mon',
		29030400: '1year',
	},
	kucoin: {
		60: '1min',
		180: '3min',
		300: '5min',
		900: '15min',
		1800: '30min',
		3600: '1hour',
		7200: '2hour',
		14400: '4hour',
		21600: '6hour',
		28800: '8hour',
		43200: '12hour',
		86400: '1day',
		604800: '1week',
	},

	mercado: {
		60: '1m',
		900: '15m',
		3600: '1h',
		10800: '3h',
		86400: '1d',
		604800: '1w',
		2419200: '1M',
	},
	novadax: {
		60: 'ONE_MIN',
		300: 'FIVE_MIN',
		900: 'FIFTEEN_MIN',
		1800: 'HALF_HOU',
		3600: 'ONE_HOU',
		86400: 'ONE_DAY',
		604800: 'ONE_WEE',
		2419200: 'ONE_MON',
	},
	okx: {
		60: '1m',
		180: '3m',
		300: '5m',
		900: '15m',
		1800: '30m',
		3600: '1H',
		7200: '2H',
		14400: '4H',
		21600: '6H',
		43200: '12H',
		86400: '1D',
		172800: '2D',
		259200: '3D',
		604800: '1W',
		2419200: '1M',
		7257600: '3M',
	},
	bybit: {
		300: '5',
		900: '15',
		1800: '30',
		3600: '60',
		7200: '120',
		14400: '240',
		21600: '360',
		43200: '720',
		86400: 'D',
		604800: 'W',
		2419200: 'M',
	},
	bingx: {
		60: '1m',
		180: '3m',
		300: '5m',
		900: '15m',
		1800: '30m',
		3600: '1h',
		7200: '2h',
		14400: '4h',
		21600: '6h',
		43200: '12h',
		86400: '1d',
		259200: '3d',
		604800: '1w',
		2419200: '1M',
	},
};

function findClosetValue(rprice, qty) {
	var prev = -1;
	var i;
	// eslint-disable-next-line guard-for-in,no-restricted-syntax
	for (i in rprice) {
		var n = parseInt(i);
		// eslint-disable-next-line eqeqeq
		if (prev != -1 && qty < n) {
			if (prev < 60) {
				return n; // Round up
			}
			return prev; // Round down
		}
		prev = n;
	}
}

export const convertToIntervalObj = (exchange, interval) => {
	const intervalMapping = interval_mapping;
	const newIntervalObj = intervalMapping[exchange];

	// if (!intervalMapping.hasOwnProperty(exchange)) {
	if (!Object.prototype.hasOwnProperty.call(intervalMapping, exchange)) {
		return null;
	}
	const newInterval = findClosetValue(newIntervalObj, interval);
	if (exchange in intervalMapping && newInterval in intervalMapping[exchange]) {
		return {
			exchange: intervalMapping[exchange][newInterval],
			tv: convertIntervalSystemToIntervalTradingView(parseInt(newInterval)),
		};
	}
	return null;
};
export const revertConvertIntervalSystemToIntervalTradingView = (interval) => {
	// second
	if (interval.endsWith('S')) {
		return parseInt(interval);
	}
	// day
	if (interval.endsWith('D')) {
		return parseInt(interval) * 3600 * 24;
	}

	// minute
	if (!isNaN(parseInt(interval))) {
		return parseInt(interval) * 60;
	}

	// Placeholder for the original value
	return 'Original value';
};
export const convertIntervalSystemToIntervalTradingView = (interval) => {
	const tvInterval = '1D';
	// second
	if (interval < 60) {
		return `${interval}S`;
	}
	// minute
	if (interval < 3600 && interval % 60 === 0) {
		return interval / 60;
	}
	// hour = minute * 60
	if (interval < 3600 * 24 && interval % 3600 === 0) {
		return interval / 60;
	}
	// day = hour * 24
	if (interval < 3600 * 24 * 7 && interval % (3600 * 24) === 0) {
		return `${interval / (3600 * 24)}D`;
	}
	return tvInterval;
};

// Generates a symbol ID from a pair of the coins
export function generateSymbol(exchange, symbol) {
	return `${exchange}:${symbol}`;
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol) {
	const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
	if (!match) {
		return null;
	}

	return {
		exchange: match[1],
		base: match[2],
		quote: match[3],
		ticker: `${match[2]}/${match[3]}`,
	};
}

// Mapping timezone tradingview
export const tvTimezoneFormat = (timezone) => {
	if (timezone === 'Asia/Saigon') {
		return 'Asia/Ho_Chi_Minh';
	}
	if (tvSupportedTimezones.includes(timezone)) {
		return timezone;
	}
	return 'Etc/UTC';
};
export const getDateFromWeek = (year, weekNumber) => {
	const date = new Date(year, 0, 1 + (weekNumber - 1) * 7);
	const day = date.getDay();

	if (day <= 4) {
		date.setDate(date.getDate() - date.getDay() + 1);
	} else {
		date.setDate(date.getDate() + 8 - date.getDay());
	}
	const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
		.getDate()
		.toString()
		.padStart(2, '0')}`;
	return formattedDate;
};

export const getLargeNumberFormat = (value) => {
	// format to xxx,xxx,xxx
	const formattedValue = `${value}`?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (formattedValue.split('.')[1]?.length === 1) {
		return `{formattedValue}0`;
	}
	return formattedValue;
};
