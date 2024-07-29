import Api from './Api';

class UserService extends Api {
	async refreshAccessToken(refreshToken) {
		return this.postAPI(`/auth/token/refresh/`, {
			refresh: refreshToken,
		});
	}

	async login(userName, password) {
		return this.postAPI(`/auth/token/`, {
			username: userName,
			password,
		});
	}

	async loginByAuth0(token) {
		return this.postAPI(`/auth/auth0/token/`, {
			access_token: token,
		});
	}

	async resendActivationEmail(captcha, email) {
		return this.postAPI(`/auth/resend_activation`, {
			captcha,
			email,
		});
	}

	async getUserProfile() {
		return this.getAPI(`/profile/user-profile`);
	}

	async changePassword(old_password, new_password, confirm_password, refresh) {
		return this.putAPI(`/auth/change-password`, {
			old_password,
			new_password,
			confirm_password,
			refresh,
		});
	}

	async updateAvatar(file) {
		const formData = new FormData();
		formData.append('avatar', file);
		return this.postAPI(`/profile/update-avatar`, formData);
	}

	async updateReferral(text) {
		return this.putAPI(`/profile/update-referral`, { referral_code: text });
	}

	async forgotPassword(email, captcha = '') {
		return this.postAPI(`/auth/forgot-password`, { email, captcha }, { showAlert: false });
	}

	async resetPassword(info) {
		return this.postAPI(`/auth/reset-password`, info);
	}

	async register(info, reCaptchaToken = '') {
		return this.postAPI(
			`/auth/register/`,
			{
				...info,
				captcha: reCaptchaToken,
			},
			{ showAlert: true }
		);
	}

	async updateProfile(info) {
		const formData = new FormData();
		Object.keys(info).forEach((key) => {
			formData.append(key, info[key]);
		});
		return this.putAPI(`/profile/update-profile`, formData);
	}

	async unlinkTelegram() {
		return this.deleteAPI(`/profile/unlink-telegram`, { showAlert: true });
	}

	async getNotifications(filter = {}) {
		return this.getAPI(`/notifications/`, filter);
	}

	async markAllNotifyAsRead() {
		return this.postAPI(`/notifications/mark-all-read`);
	}

	async markNotifyAsRead(slug) {
		return this.postAPI(`/notifications/mark-as-read/${slug}`);
	}

	async getUnreadNotifyCount() {
		return this.getAPI(`/notifications/unread/count`);
	}

	async linkTelegram(code) {
		return this.postAPI(`/profile/link-telegram?code=${code}`);
	}

	async getTimezones() {
		return this.getAPI(`/timezones/`);
	}

	async terminateAccount(username) {
		return this.postAPI(`/auth/terminate-account`, {
			username,
		});
	}

	async logout(refreshToken) {
		return this.postAPI(`/auth/logout/`, {
			refresh: refreshToken,
		});
	}

	async getProxieslist() {
		return this.getAPI(`/proxies/`);
	}

	async generateTotp() {
		return this.getAPI(`/profile/generate-totp`);
	}

	async activateTotp(data) {
		return this.postAPI(`/profile/activate-totp`, data);
	}

	async verifyTotp(data) {
		return this.postAPI(`/auth/verify-totp`, data);
	}

	async getResetTotp(data) {
		return this.postAPI(`/profile/get-reset-totp`, data);
	}

	async sendTotpWithEmail(data) {
		return this.getAPI(`/profile/send-reset-totp`, data);
	}

	async resetTotp(data) {
		return this.postAPI(`/profile/reset-totp`, data);
	}
}

export default new UserService();
