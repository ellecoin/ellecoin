import axios from 'axios';
import Api from './Api';

class BotService extends Api {
	async getBots(filter = {}) {
		return this.getAPI(`/volatilitybot/`, filter);
	}

	async getBotsSupportFilter(filter = {}) {
		return this.getAPI(`/volatilitybot/support_filter/`, filter);
	}

	async getBotDetail(botId) {
		return this.getAPI(`/volatilitybot/${botId}/`);
	}

	async updateBot(botId, info) {
		return this.patchApi(`/volatilitybot/${botId}/`, info);
	}

	async updateBotStatus(botId, filter = {}) {
		return this.postAPI(`/volatilitybot/${botId}/action/`, filter, {
			showAlert: true,
		});
	}

	async getBoughtCoin(filter = {}) {
		return this.getAPI(`/coinsbought/`, filter);
	}

	async getBotProfitHis(botId, type, limit, fromDate, toDate) {
		return this.getAPI(`/volatilitybot/profithistorybot/`, {
			bot_id: botId,
			report_type: type,
			limit,
		});
	}

	async getOrderHistory(filter) {
		return this.getAPI(`/ordervolbothistory/`, filter);
	}

	async getFutureOrderHistory(filter) {
		return this.getAPI(`/futureordervolbothistory/`, filter);
	}

	async sellBoughtCoin(boughtCoinId) {
		return this.postAPI(`/volatilitybot/coinboughts/${boughtCoinId}/sell/`, null, {
			showAlert: true,
		});
	}

	async getBotPnl(botId) {
		return this.getAPI(`/volatilitybot/daily-pnl-bot/${botId}`);
	}

	async createBot(data) {
		return this.postAPI(`/volatilitybot/`, data);
	}

	async deleteBot(botId) {
		return this.deleteAPI(`/volatilitybot/${botId}/`);
	}

	async getBotEvents(botId, filter) {
		return this.getAPI(`/botevents/${botId}/`, filter);
	}

	async validateBotName(name, type = 'fixed') {
		return this.postAPI(`/volatilitybot/verify-bot-name`, {
			bot_name: name,
		});
	}

	async getFearAndGreed(limit = 7) {
		return this.getAPI(`/fng/?limit=${limit}`);
	}

	async getBotTemplates(filter = {}) {
		return this.getAPI(`/volatilitybottemplate/`, filter);
	}

	async getBotTemplateDetail(id) {
		return this.getAPI(`/volatilitybottemplate/${id}/`);
	}

	async getPauseIndicators(filter = {}) {
		return this.getAPI(`/indicatorpresets/`, filter);
	}

	async deletePauseIndicator(id) {
		return this.deleteAPI(`/indicatorpresets/${id}/`, { showAlert: true });
	}

	async createPauseIndicator(info) {
		return this.postAPI(`/indicatorpresets/`, info, { showAlert: true });
	}

	async updatePauseIndicator(id, info) {
		return this.putAPI(`/indicatorpresets/${id}/`, info, { showAlert: true });
	}

	async getPauseIndicatorInfo(id) {
		return this.getAPI(`/indicatorpresets/${id}/`);
	}

	async exportTransactions(filter = {}) {
		return this.getAPI(`/ordervolbothistory/export/`, filter, {
			responseType: 'blob',
		});
	}

	async deleteBoughtCoin(botId) {
		return this.deleteAPI(`/coinsbought/${botId}/`);
	}

	async startBacktest(info) {
		return this.postAPI(`/backtest/`, info, { showAlert: true });
	}

	async getBacktests(filter = {}) {
		return this.getAPI(`/backtest/`, filter);
	}

	async getBacktestDetail(backtestId, filter) {
		return this.getAPI(`/backtest/${backtestId}`, filter);
	}

	async updateBacktestStatus(backtestId, info) {
		return this.postAPI(`/backtest/${backtestId}/action/?bot_id=${info.bot_id}`, info, { showAlert: true });
	}

	async getBotEventList(filter) {
		return this.getAPI(`/bot-event/`, filter);
	}

	async bulkAction(data) {
		return this.postAPI(`/volatilitybot/bulk-action/`, data);
	}

	async caculatePNLInBulk(data) {
		return this.postAPI(`/volatilitybot/calculate-pnl-in-bulk/`, data);
	}

	async checkBulkBotRunning(data) {
		return this.postAPI(`/volatilitybot/check-bulk-delete/`, data);
	}

	async importBots(data) {
		return this.postAPI(`/volatilitybot/import/`, data);
	}

	async autoGenerateBotname(data) {
		return this.postAPI(`/volatilitybot/auto-generate-botname`, data);
	}

	async getExportList(filter) {
		const encodedFilter = {};
		Object.keys(filter).forEach((key) => {
			encodedFilter[key] = encodeURIComponent(filter[key]);
		});
		const encodedBotsId = encodeURIComponent(filter.bot_ids);
		return this.getAPI(
			`/volatilitybot/export/?bot_ids=${encodedBotsId}`,
			{},
			{
				responseType: 'blob',
			}
		);
	}

	async getPNLAnalysisBasicData() {
		return this.getAPI(`/volatilitybot/analytics`);
	}
}

export default new BotService();
