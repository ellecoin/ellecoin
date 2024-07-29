import axios from 'axios';
import { Modal } from 'antd';
import i18next from 'i18next';
import tokenStore from '../stores/TokenStore';
import stateStore from '../stores/StateStore';

export default class Api {
	basePath = `${process.env.REACT_APP_API_BASE_URL}`;

	constructor() {
		axios.defaults.withCredentials = false;
	}

	getUrl(target) {
		if (!target.startsWith('http')) {
			return `${stateStore.language ? `/${stateStore.language}` : ''}${this.basePath}${target}`;
		}
		return target;
	}

	getHeader(target, forForm = false) {
		return {
			'Content-Type': forForm ? 'multipart/form-data' : 'application/json',
			Authorization: !target.startsWith('http') && tokenStore.token ? `Bearer ${tokenStore.token}` : undefined,
		};
	}

	isResponseError(resp) {
		return ![200, 201, 204].includes(resp.status);
	}

	async postAPI(target, data, options = { getFullResp: false, showAlert: false, forForm: false }) {
		return axios
			.post(this.getUrl(target), data, {
				headers: this.getHeader(target, options.forForm),
			})
			.then((resp) => {
				if (this.isResponseError(resp) && options.showAlert) {
					if (options.showAlert) {
						return this.handleError(resp.data, true);
					}
					return resp.data;
				}
				if (options.getFullResp) {
					return resp;
				}
				return resp.data;
			})
			.catch((err) => this.handleError(err, options.showAlert));
	}

	async patchApi(target, data, options = { getFullResp: false, showAlert: false }) {
		return axios
			.patch(this.getUrl(target), data, {
				headers: this.getHeader(target),
			})
			.then((resp) => {
				if (this.isResponseError(resp)) {
					this.handleError(resp.data, options.showAlert);
				} else if (options.getFullResp) {
					return resp;
				} else {
					return resp.data;
				}
			})
			.catch((err) => this.handleError(err, options.showAlert));
	}

	async getAPI(target, params, options = { getFullResp: false, showAlert: false }) {
		return axios
			.get(this.getUrl(target), {
				headers: this.getHeader(target),
				params: params || {},
				responseType: options.responseType,
			})
			.then((resp) => {
				if (this.isResponseError(resp) && options.showAlert) {
					this.handleError(resp.data, options.showAlert);
				} else if (options.getFullResp) {
					return resp;
				} else {
					return resp.data;
				}
			})
			.catch((err) => this.handleError(err, options.showAlert));
	}

	async putAPI(target, data, options = { getFullResp: false, showAlert: false }) {
		return axios
			.put(this.getUrl(target), data, {
				headers: this.getHeader(target),
			})
			.then((resp) => {
				if (this.isResponseError(resp) && options.showAlert) {
					this.handleError(resp.data, options.showAlert);
				} else if (options.getFullResp) {
					return resp;
				} else {
					return resp.data;
				}
			})
			.catch((err) => this.handleError(err, options.showAlert));
	}

	async deleteAPI(target, options = { getFullResp: false, showAlert: false }) {
		return axios
			.delete(this.getUrl(target), {
				headers: this.getHeader(target),
			})
			.then((resp) => {
				if (this.isResponseError(resp) && options.showAlert) {
					this.handleError(resp.data, options.showAlert);
				} else if (options.getFullResp) {
					return resp;
				} else {
					return resp.data;
				}
			})
			.catch((err) => this.handleError(err, options.showAlert));
	}

	handleError(error, showAlert = false) {
		if (error.response?.status === 401) {
			tokenStore.logout();
			window.location.href = '/';
			return;
		}

		if (error.response) {
			const errorMessage = error.response.data.errors;
			if (errorMessage) {
				if (showAlert && errorMessage.message) {
					Modal.error({
						title: errorMessage.message,
						okText: i18next.t('close'),
					});
				}
				return Promise.reject({
					data: error.response.data,
					error: errorMessage,
					errors: error.response.data.errors,
					status_code: error.response?.status,
				});
			}
			return Promise.reject({
				data: error.response.data,
				error: errorMessage,
				errors: error.response.data,
				status_code: error.response?.status,
			});
		}
		if (showAlert) {
			Modal.error({
				title: i18next.t('unknown_error'),
				okText: i18next.t('close'),
			});
		}
		return Promise.reject({
			error: i18next.t('unknown_error'),
			status_code: error.response?.status || 500,
		});
	}
}
