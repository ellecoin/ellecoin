import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useLocation, withRouter } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import { withTranslation } from 'react-i18next';

import { themeObject } from '../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../context/ThemeContext';
import DesktopHeader from '../../header/layout/DesktopHeader';
import { useResponsive } from '../../../hooks/useResponsive';
import MobileHeader from '../../header/layout/MobileHeader';
import { useStore } from '../../../context/AppContext';

const { Header } = Layout;

const MainHeader = ({ t }) => {
	const { mobileOnly } = useResponsive();
	const { stateStore, authStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const location = useLocation();
	const path = window.location.pathname.split('/');
	const name = path[path.length - 1].split('-');
	const filterName = name.length >= 3 ? name.filter((n, i) => i > 0) : name;
	const finalName = filterName.includes('app')
		? filterName.filter((f) => f !== 'app')
		: filterName.includes('ui')
		? filterName.filter((f) => f !== 'ui')
		: filterName.includes('uc')
		? filterName.filter((f) => f !== 'uc')
		: filterName.includes('basic')
		? filterName.filter((f) => f !== 'basic')
		: filterName.includes('jquery')
		? filterName.filter((f) => f !== 'jquery')
		: filterName.includes('table')
		? filterName.filter((f) => f !== 'table')
		: filterName.includes('page')
		? filterName.filter((f) => f !== 'page')
		: filterName.includes('email')
		? filterName.filter((f) => f !== 'email')
		: filterName.includes('ecom')
		? filterName.filter((f) => f !== 'ecom')
		: filterName.includes('chart')
		? filterName.filter((f) => f !== 'chart')
		: filterName.includes('editor')
		? filterName.filter((f) => f !== 'editor')
		: filterName;

	useEffect(() => {
		if (location.pathname === '/') {
			if (!mobileOnly) {
				stateStore.setHeaderTitle(
					<span className="font-normal text-[16px]">
						{t('home_title')},{' '}
						<span className="text-primary font-semibold">{authStore.user?.user_name}!</span>
					</span>
				);
			} else {
				stateStore.setHeaderTitle(t('home'));
			}
		}
		if (location.pathname === '/exchanges') {
			stateStore.setHeaderTitle(t('my-wallets'));
		} else if (location.pathname.startsWith('/exchanges/')) {
			stateStore.setHeaderTitle(t('exchange_detail'));
		}
		if (location.pathname === '/transactions') {
			stateStore.setHeaderTitle(t('transaction'));
		}
		if (location.pathname === '/spot-orders') {
			stateStore.setHeaderTitle(t('spot_orders'));
		}
		if (location.pathname === '/bots') {
			stateStore.setHeaderTitle(t('bots'));
		}
		if (location.pathname.startsWith('/bots/my-bot/detail')) {
			stateStore.setHeaderTitle(t('bot_detail'));
		}
		if (location.pathname.startsWith('/bots/my-bot/create')) {
			stateStore.setHeaderTitle(t('create_bot'));
		}
		if (location.pathname === '/presets') {
			stateStore.setHeaderTitle(t('ticker_preset'));
		}
		if (location.pathname === '/presets/create') {
			stateStore.setHeaderTitle(t('create_preset'));
		}
		if (location.pathname.startsWith('/presets/fixed') || location.pathname.startsWith('/presets/dynamic')) {
			stateStore.setHeaderTitle(t('update_preset'));
		}
		if (location.pathname === '/user/profile') {
			stateStore.setHeaderTitle(t('profile'));
		}
	}, [location.pathname, stateStore.language, t, mobileOnly]);

	const themeConfig = {
		token: {
			colorTextBase: themeObject[typeTheme].colorTextBaseHeader,
			fontSize: 14,
		},
		components: {
			Layout: {
				headerBg: themeObject[typeTheme].colorBgHeader,
				controlHeight: 38,
				lineHeight: 38,
				controlPaddingHorizontal: 16,
			},
			Dropdown: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: themeObject[typeTheme].colorBgDropdown,
				colorBgElevated: themeObject[typeTheme].colorBgDropdown,
			},
			Popover: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: themeObject[typeTheme].colorBgDropdown,
				colorBgElevated: themeObject[typeTheme].colorBgDropdown,
			},
		},
	};

	return (
		<ConfigProvider theme={themeConfig}>
			<Header
				className={`lg:pl-[42px] px-4 lg:pr-[34px] shadow-lg shadow-${themeObject[typeTheme].background} sticky z-[1000] top-0`}
			>
				{mobileOnly ? <MobileHeader headerName={finalName} /> : <DesktopHeader headerName={finalName} />}
			</Header>
		</ConfigProvider>
	);
};

export default withRouter(withTranslation()(observer(MainHeader)));
