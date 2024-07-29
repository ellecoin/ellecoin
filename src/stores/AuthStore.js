import { makeAutoObservable, reaction } from 'mobx';
import dayjs from 'dayjs';
import tokenStore from './TokenStore';
import userService from '../services/UserService';
import stateStore from './StateStore';

class AuthStore {
	user = null;

	unreadNotifyCount = 0;

	constructor() {
		makeAutoObservable(this);

		reaction(
			() => stateStore.language,
			(lang) => {
				localStorage.setItem('language', lang);
				if (this.user && stateStore.language && stateStore.language !== this.user.language) {
					this.updateUser({ language: lang });
					userService.updateProfile({ language: lang }).then(() => {});
				}
			}
		);

		reaction(
			() => stateStore.currency,
			(currency) => {
				if (this.user && stateStore.currency && stateStore.currency !== this.user.currency) {
					this.updateUser({ currency });
					userService.updateProfile({ currency }).then(() => {});
				}
			}
		);

		reaction(
			() => stateStore.demoMode,
			(demoMode) => {
				localStorage.setItem('demoMode', demoMode);
				if (this.user && demoMode !== this.user.demo_mode) {
					userService.updateProfile({ demo_mode: demoMode }).then(() => {
						this.updateUser({ demo_mode: demoMode });
					});
				}
			}
		);
	}

	loadUserProfile() {
		this.loadNotifyCount();
		return userService.getUserProfile().then((res) => {
			this.user = res;
			stateStore.language = res.language;
			stateStore.currency = res.currency;
			stateStore.demoMode = res.demo_mode;
			stateStore.brl2UsdExchangeRate = res.exchange_rates?.BRLUSD?.price || 1;
			dayjs.tz.setDefault(res.timezone || dayjs.tz.guess());
			const telegramLinkCode = localStorage.getItem('link-telegram-code');
			if (telegramLinkCode) {
				this.linkTelegram(telegramLinkCode);
				localStorage.removeItem('link-telegram-code');
			}
			return res;
		});
	}

	updateUserLanguage(language, callApi = true) {
		if (callApi) {
			userService.updateProfile({ language, detected_language: true }).then((res) => {
				this.user = { ...this.user, language };
				stateStore.language = this.user.language;
			});
		} else {
			stateStore.language = language;
		}
	}

	logout() {
		this.user = null;
		tokenStore.logout();
		localStorage.removeItem('language');
		localStorage.removeItem('demoMode');
	}

	updateUser(info) {
		this.user = { ...this.user, ...info };
		stateStore.language = this.user.language;
		stateStore.currency = this.user.currency;
		stateStore.demoMode = this.user.demo_mode;
		stateStore.brl2UsdExchangeRate = this.user.exchange_rates?.BRLUSD?.price || 1;
		if (info.timezone) {
			dayjs.tz.setDefault(info.timezone);
		}
	}

	getConvertedCurrency(value, exchange) {
		if (exchange === 'mercado' || this.user.currency === 'brl') {
			const v = this.user.exchange_rates?.BRLUSD?.price
				? (value || 0) / this.user.exchange_rates?.BRLUSD?.price
				: value;
			return `R$${Math.round(v * 1000000) / 1000000}`;
		}
		return `$${Math.round(value * 1000000) / 1000000}`;
	}

	setUnreadNotifyCount(count) {
		this.unreadNotifyCount = count;
	}

	loadNotifyCount() {
		userService.getUnreadNotifyCount().then(({ unread_count }) => (this.unreadNotifyCount = unread_count));
	}

	markAllNotifyAsRead() {
		return userService.markAllNotifyAsRead().then(() => {
			this.unreadNotifyCount = 0;
		});
	}

	markNotifyAsRead(slug) {
		return userService.markNotifyAsRead(slug).then(() => {
			this.unreadNotifyCount = Math.max(this.unreadNotifyCount - 1, 0);
		});
	}

	linkTelegram(code) {
		return userService.linkTelegram(code).then((info) => {
			this.user = { ...(this.user || {}), ...info };
		});
	}

	change2FAStatus(status) {
		this.user = { ...this.user, '2fa_enabled': status };
	}

	getUnreadNotifyCount() {
		return this.unreadNotifyCount;
	}
}

export default new AuthStore();
