import tokenStore from './TokenStore';
import authStore from './AuthStore';
import stateStore from './StateStore';
import tickerStore from './TickerStore';

export default class AppStore {
	tokenStore = tokenStore;

	authStore = authStore;

	stateStore = stateStore;

	tickerStore = tickerStore;
}
