import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './assets/locales/en/translation.json';
import translationPT from './assets/locales/pt/translation.json';
import translationES from './assets/locales/es/translation.json';
import translationVI from './assets/locales/vi/translation.json';

const fallbackLng = ['en'];
const availableLanguages = ['en', 'pt', 'es', 'vi'];

const resources = {
	en: {
		translation: translationEN,
	},
	pt: {
		translation: translationPT,
	},
	es: {
		translation: translationES,
	},
	vi: {
		translation: translationVI,
	},
};

i18n
	// .use(Backend)
	// .use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng,

		lg: localStorage.getItem('language') || 'en',

		detection: {
			checkWhitelist: true,
		},

		debug: false,

		whitelist: availableLanguages,

		interpolation: {
			escapeValue: false,
		},
	});

i18n.changeLanguage(localStorage.getItem('language') || 'en');

export default i18n;
