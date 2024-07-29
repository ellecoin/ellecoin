export const LANGUAGES = [
	{ value: 'en', matchCountries: ['us', 'gb', 'eg', 'sg'] },
	{ value: 'es', matchCountries: ['es'] },
	{ value: 'pt', matchCountries: ['pt', 'br'] },
	{ value: 'vi', matchCountries: ['vn'] },
];

export const ACCEPT_LANGUAGES = LANGUAGES.map((language) => language.value);
