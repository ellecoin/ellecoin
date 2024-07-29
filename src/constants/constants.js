export const MARKET_MODE = {
	all: 'all',
	spot: 'spot',
	// future: 'future',
};

export const MARKET_MODE_OPTS = [
	{ label: 'All', value: 'all' },
	{ label: 'Spot', value: 'spot' },
	// { label: 'Future', value: 'future' },
];

export const MODAL_TYPES = {
	info: 'info',
	success: 'success',
	error: 'error',
	warning: 'warning',
	confirm: 'confirm',
};

export const MARKET_MODE_SPOT_OPT = MARKET_MODE_OPTS.filter((mode) => mode.value === 'spot');
