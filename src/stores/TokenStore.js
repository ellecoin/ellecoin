import { makeAutoObservable, reaction } from 'mobx';
import jwtDecode from 'jwt-decode';

class TokenStore {
	token = null;

	token2FA = null;

	refreshToken = null;

	isLoading = true;

	constructor() {
		makeAutoObservable(this);

		this.token = localStorage.getItem('accessToken') || '';
		reaction(
			() => this.token,
			(token) => {
				localStorage.setItem('accessToken', token);
			}
		);

		this.token2FA = localStorage.getItem('token2FA') || '';
		reaction(
			() => this.token2FA,
			(token) => {
				localStorage.setItem('token2FA', token);
			}
		);

		this.refreshToken = localStorage.getItem('refreshToken') || '';
		reaction(
			() => this.refreshToken,
			(token) => {
				localStorage.setItem('refreshToken', token);
			}
		);
	}

	isAuthenticated() {
		if (!this.token) {
			return false;
		}
		const { exp } = jwtDecode(this.token);
		return exp * 1000 > Date.now();
	}

	refreshAccessToken() {
		if (!this.token) {
			this.isLoading = false;
			return Promise.resolve();
		}

		const { exp } = jwtDecode(this.token);
		if (exp * 1000 > Date.now()) {
			this.isLoading = false;
			return Promise.resolve();
		}

		const refreshTokenInfo = jwtDecode(this.refreshToken);
		if (refreshTokenInfo.exp * 1000 < Date.now()) {
			this.isLoading = false;
			return Promise.resolve();
		}
	}

	setToken(token) {
		this.token = token;
	}

	setToken2FA(token2FA) {
		this.token2FA = token2FA;
	}

	setRefreshToken(token) {
		this.refreshToken = token;
	}

	logout() {
		this.token = '';
		this.refreshToken = '';
	}

	getToken() {
		return this.token;
	}

	getToken2FA() {
		return this.token2FA;
	}
}

export default new TokenStore();
