import { makeAutoObservable } from 'mobx';
import stringSimilarity from 'string-similarity';
import tickerService from '../services/TickerService';

class TickerStore {
	allTickers = null;

	searchKeyword = '';

	fetching = false;

	constructor() {
		makeAutoObservable(this);
	}

	getAllTickers() {
		if (this.allTickers) {
			return Promise.resolve(this.allTickers);
		}
		this.fetching = true;
		return tickerService
			.searchCoin({ limit: 100000 })
			.then(({ results }) => {
				this.allTickers = results;
				return results;
			})
			.finally(() => {
				this.fetching = false;
			});
	}

	searchAllTicker(keyword) {
		if (this.fetching) {
			this.searchKeyword = keyword;
			return Promise.resolve([]);
		}
		this.searchKeyword = keyword;
		return this.getAllTickers().then((allCoins) =>
			allCoins
				.filter(({ base }) => base?.toLowerCase().includes(this.searchKeyword?.toLowerCase()))
				.map(({ base }) => {
					const score = stringSimilarity.compareTwoStrings(
						base.toLowerCase(),
						this.searchKeyword?.toLowerCase()
					);
					return {
						base,
						score,
					};
				})
				.sort((s1, s2) => s1.score - s2.score)
		);
	}
}

export default new TickerStore();
