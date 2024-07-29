import { ACCEPT_LANGUAGES } from '../constants/data';

const matchBrowserLanguage = (browserLanguage = '') => {
	const splitLanguageString = browserLanguage.split('-');

	if (splitLanguageString.length > 0) {
		const language = splitLanguageString[0].toLocaleLowerCase();
		if (ACCEPT_LANGUAGES.indexOf(language) > -1) return language;
	}

	return 'en';
};

export { matchBrowserLanguage };

export const LANGUAGE = [
	{
		label: 'English',
		path: '/images/flag-en.svg',
		alt: 'English',
		key: 'en',
	},
];
