import { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import AppStore from '../stores/AppStore';
import userService from '../services/UserService';
import { matchBrowserLanguage } from '../utils/language';

const AppContext = createContext();

export const useStore = () => {
	const context = useContext(AppContext);
	return context.store;
};

export const useAuth = () => useContext(AppContext);

const AppContextProvider = ({ children, i18n }) => {
	const history = useHistory();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const store = useRef(new AppStore());

	const contextValue = useMemo(
		() => ({
			store: store.current,
			isAuthenticated,
			isLoading,
		}),
		[isAuthenticated, isLoading]
	);

	const { tokenStore, authStore } = store.current;

	useEffect(() => {
		setIsLoading(true);
		const browserLanguage = matchBrowserLanguage(window.navigator.language);
		if (tokenStore.isAuthenticated()) {
			authStore
				.loadUserProfile()
				.then(({ language, detected_language, demo_mode }) => {
					i18n.changeLanguage(language);
					setIsAuthenticated(true);
					setIsLoading(false);
					if (detected_language === false) {
						authStore.updateUserLanguage(browserLanguage);
						i18n.changeLanguage(browserLanguage);
					}
				})
				.catch(({ status_code }) => {
					if (status_code === 401) {
						tokenStore.logout();
						history.replace('/login');
					}
				});
			return;
		}
		authStore.updateUserLanguage(browserLanguage, false);
		i18n.changeLanguage(browserLanguage);

		if (!tokenStore.refreshToken) {
			setIsAuthenticated(false);
			setIsLoading(false);
			return;
		}

		userService
			.refreshAccessToken(tokenStore.refreshToken)
			.then(({ access }) => {
				tokenStore.setToken(access);
				return authStore
					.loadUserProfile()
					.then(({ language }) => {
						i18n.changeLanguage(language);
						setIsAuthenticated(true);
					})
					.catch(({ status_code }) => {
						if (status_code === 401) {
							tokenStore.logout();
							history.replace('/login');
						}
					});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [tokenStore.token]);

	return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default withTranslation()(observer(AppContextProvider));
