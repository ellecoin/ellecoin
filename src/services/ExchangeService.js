import Api from './Api';

class ExchangeService extends Api {
	async getMyExchanges(filter = {}) {
		return this.getAPI(`/myexchanges/`, filter);
	}

	async getMyExchangesSupportFilter(filter = {}) {
		return this.getAPI(`/myexchanges/support_filter/`, filter);
	}

	async createExchange(infos) {
		return this.postAPI(`/myexchanges/`, infos);
	}

	async updateExchange(exchangeId, infos) {
		return this.patchApi(`/myexchanges/${exchangeId}/`, infos);
	}

	async deleteExchange(exchangeId) {
		return this.deleteAPI(`/myexchanges/${exchangeId}/`);
	}

	async getExchangeInfo(exchangeId) {
		return this.getAPI(`/myexchanges/${exchangeId}/`);
	}

	async reSyncExchange(exchangeId) {
		return this.getAPI(`/myexchanges/sync-balance/${exchangeId}/`);
	}

	async getExchangeTokens(exchangeId, filter) {
		return this.getAPI(`/myexchanges/wallet/${exchangeId}/`, filter);
	}

	async getExchangePortfolio(exchangeId, filter) {
		return this.getAPI(`/myexchanges/portfolio/${exchangeId}/`, filter);
	}

	async getIntegratedExchanges() {
		return this.getAPI(`/exchanges/`).then(({ results }) => ({
			results: results.map((result) => {
				if (!result.trading_pairs || result.trading_pairs.length === 0) {
					result.trading_pairs = [{ quote: 'USDT' }];
				}
				return result;
			}),
		}));
	}
}

export default new ExchangeService();
