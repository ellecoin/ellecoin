import Api from './Api';

class TickerService extends Api {
	async getTickerPrice() {
		return this.getAPI(
			'https://quantifycrypto.com/api/v1.0/widgets/price-tickers?top_gainers_losers=true&top_20_coins=true&currency=USD'
		);
	}

	async createTickerPreset(name, tickers, exchange, pair) {
		return this.postAPI('/tickerpresets/', { preset_name: name, tickers, exchange, pair }, { showAlert: true });
	}

	async createDynamicTickerPreset(name, rules, exchange, pair) {
		return this.postAPI(
			'/advancedfilter/',
			{
				title: name,
				model: 'analytics.LatestCoinsData',
				children: rules,
				exchange,
				pair,
			},
			{ showAlert: true }
		);
	}

	async getTickerPreset(filter = {}) {
		return this.getAPI('/tickerpresets/', filter);
	}

	async getDynamicPreset(filter = {}) {
		return this.getAPI('/advancedfilter/', filter);
	}

	async getTickerPresetDetail(presetId) {
		return this.getAPI(`/tickerpresets/${presetId}/`);
	}

	async getDynamicPresetDetail(presetId) {
		return this.getAPI(`/advancedfilter/${presetId}/`);
	}

	async updateTickerPreset(presetId, info) {
		return this.putAPI(`/tickerpresets/${presetId}/`, info);
	}

	async updateDynamicPreset(presetId, info) {
		return this.patchApi(`/advancedfilter/${presetId}/`, info);
	}

	async deleteFixedPreset(id) {
		return this.deleteAPI(`/tickerpresets/${id}/`, { showAlert: true });
	}

	async deleteDynamicPreset(id) {
		return this.deleteAPI(`/advancedfilter/${id}/`, { showAlert: true });
	}

	async searchDynamicTicker(rules, exchange, pair) {
		return this.postAPI(`/advancedfilter-search/`, {
			model: 'analytics.LatestCoinsData',
			children: rules,
			exchange,
			pair,
		});
	}

	async validatePresetName(name, type = 'fixed') {
		return this.postAPI(`/verify-preset-name`, {
			preset_name: name,
			preset_type: type,
		});
	}

	async searchSymbol(exchange, filter = {}) {
		return this.getAPI(`/exchanges/coins/${exchange}/`, filter);
	}

	async searchCoin(filter = {}) {
		return this.getAPI(`/exchanges/search-coins/all/`, filter);
	}

	async exportPreset(filter, activeTab) {
		const url = activeTab === 'fixed' ? '/tickerpresets/export/' : '/advancedfilter/export/';
		return this.getAPI(url, filter, {
			responseType: 'blob',
		});
	}

	async importPreset(file, activeTab) {
		const url = activeTab === 'fixed' ? '/tickerpresets/import_data/' : '/advancedfilter/import_data/';
		return this.postAPI(url, file);
	}
}

export default new TickerService();
