import { makeAutoObservable } from 'mobx';

class StateStore {
	headerTitle = '';

	language = localStorage.getItem('language') || 'en';

	currency = 'usd';

	brl2UsdExchangeRate = 1;

	demoMode = localStorage.getItem('demoMode') || true;

	constructor() {
		makeAutoObservable(this);
	}

	setHeaderTitle(title) {
		this.headerTitle = title;
	}

	setCurrency(currency) {
		this.currency = currency;
	}

	setLanguage(lang) {
		this.language = lang;
	}

	setDemoMode(isDemo) {
		this.demoMode = isDemo;
	}

	removeLanguageCache() {
		localStorage.removeItem('language');
	}

	getCurrency(value, exchange) {
		const isNegative = value < 0;
		let rate = 1;
		if (exchange === 'mercado' && this.currency === 'usd') {
			rate = this.brl2UsdExchangeRate;
		}
		const v = Math.round(((Math.abs(value) || 0) * 100) / rate) / 100;
		const moneyFormat = `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		if (this.currency === 'brl' || exchange === 'mercado') {
			return `${isNegative ? '-' : ''}R$${moneyFormat}`;
		}
		if (this.currency === 'vnd') {
			return `${isNegative ? '-' : ''}₫${moneyFormat}`;
		}
		return `${isNegative ? '-' : ''}$${moneyFormat}`;
	}

	// Only for display exchange with Demo Mode
	displayExchangeTotal(value, exchange) {
		const isNegative = value < 0;
		let rate = 1;
		if (!this.demoMode && exchange === 'mercado' && this.currency === 'usd') {
			rate = this.brl2UsdExchangeRate;
		}

		const v = Math.round(((Math.abs(value) || 0) * 100) / rate) / 100;
		const moneyFormat = `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

		if ((!this.demoMode && this.currency === 'brl') || exchange === 'mercado') {
			return `${isNegative ? '-' : ''}R$${moneyFormat}`;
		}
		return `${isNegative ? '-' : ''}$${moneyFormat}`;
	}
}

export default new StateStore();
