import Api from './Api';

class TransactionsService extends Api {
	async getPositionHistoryList(filter) {
		return this.getAPI(`/position-history/`, filter);
	}
}

export default new TransactionsService();
