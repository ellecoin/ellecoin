import React, { useContext, useState, useEffect } from 'react';
import { Button, ConfigProvider, Drawer, Layout } from 'antd';
import { Link, useHistory, useLocation, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { ThemeContext } from '../../../../context/ThemeContext';
import Image from '../../../Image';
import { themeObject } from '../../../../styles/themes/themeVariables';
import * as S from './MainSider.styles';
import { useResponsive } from '../../../../hooks/useResponsive';
import HelpCenterIcon from '../../../../assets/icons/HelpCenterIcon';
import DotIcon from '../../../../assets/icons/DotIcon';

const { Sider } = Layout;

function getItem(label, key, icon, children, popupClassName) {
	return {
		key,
		icon,
		children,
		label,
		popupClassName,
	};
}

const rootSubmenuKeys = ['/', '/exchanges', '/transactions', '/bots'];

const MainSider = ({ t }) => {
	const { typeTheme, collapsed, openSider } = useContext(ThemeContext);
	const history = useHistory();
	const location = useLocation();
	const { mobileOnly, useMediaQuery } = useResponsive();
	const [openKeys, setOpenKeys] = useState([]);

	const onOpenChange = (keys) => {
		const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
		if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			setOpenKeys(keys);
		} else {
			setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
		}
	};

	useEffect(() => {
		setOpenKeys([location.pathname]);
	}, [location.pathname, collapsed]);

	const bigScreen = useMediaQuery({
		query: `(min-width: 1442px)`,
	});

	const onClick = (e) => {
		history.push(e.key);
		if (mobileOnly) {
			openSider(!collapsed);
		}
	};

	const items = [
		getItem(
			t('home'),
			'/',
			<Image className="w-[19px] h-[20px] rounded-none mr-2" src="/images/menu-icon/home.svg" alt="altImage" />
		),
		getItem(
			t('My Exchanges'),
			'/exchanges',
			<Image className="w-[19px] h-[20px] rounded-none mr-2" src="/images/menu-icon/wallet.svg" alt="altImage" />
		),
		getItem(
			t('transaction'),
			'/transactions',
			<Image
				className="w-[19px] h-[20px] rounded-none mr-2"
				src="/images/menu-icon/document.svg"
				alt="altImage"
			/>
		),
		getItem(
			t('bots'),
			'/bots',
			<Image className="w-[19px] h-[20px] rounded-none mr-2" src="/images/menu-icon/bot.svg" alt="altImage" />
		),
	];

	const themeConfig = {
		token: {
			fontSize: 16,
			colorBgSpotlight: themeObject[typeTheme].colorBgSider,
			borderRadiusLG: 8,
			borderRadiusSM: 8,
			colorTextBase: themeObject[typeTheme].colorTextSiderPrimary,
			colorBgBase: themeObject[typeTheme].colorBgSider,
			colorBgElevated: themeObject[typeTheme].colorBgSider,
			controlItemBgActive: '#333964',
			colorPrimary: '#ffffff',
		},
		components: {
			Menu: {
				itemBg: themeObject[typeTheme].colorBgSider,
				controlHeightLG: 56,
			},
			Drawer: {
				itemBg: themeObject[typeTheme].colorBgSider,
			},
			Tooltip: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: themeObject[typeTheme].colorBgDropdown,
				colorBgElevated: themeObject[typeTheme].colorBgDropdown,
				colorBgSpotlight: themeObject[typeTheme].colorBgSider,
			},
		},
	};

	const getSiderMenu = () => (
		<div className="pb-[50px]">
			<S.Menu
				theme={typeTheme}
				defaultSelectedKeys={[location.pathname]}
				mode="inline"
				items={items}
				onClick={onClick}
				selectedKeys={[location.pathname]}
				openKeys={openKeys}
				onOpenChange={onOpenChange}
			/>
		</div>
	);

	const onClickCollapseSidebar = () => {
		const newCollapsed = !collapsed;
		openSider(newCollapsed);
	};

	return (
		<ConfigProvider theme={themeConfig}>
			{mobileOnly ? (
				<Drawer title="Menu" placement="left" onClose={() => openSider(!collapsed)} open={collapsed}>
					{getSiderMenu()}
				</Drawer>
			) : (
				<Sider
					width={bigScreen ? 342 : 272}
					className={`${!collapsed && bigScreen ? 'px-[32px] min-w-[278px]' : ''} ${
						!collapsed && bigScreen ? 'uncollapsedClass' : 'collapsedClass'
					}  py-[20px] sticky top-0 left-0 overflow-x-hidden h-screen`}
					collapsed={collapsed}
					defaultCollapsed={collapsed}
					trigger={null}
					style={{ background: themeObject[typeTheme].colorBgSider }}
				>
					<div
						className={`flex items-center h-[76px] mb-[64px] ${
							collapsed ? 'justify-center' : 'justify-between px-[12px] pt-[8px]'
						}`}
					>
						<div className={`${collapsed ? '' : 'w-[80%]'} flex items-center gap-3`}>
							<Image className={`${collapsed ? 'hidden' : 'h-auto'}`} src="/images/logo.png" alt="Logo" />
						</div>
						<button onClick={onClickCollapseSidebar}>
							<Image
								className="w-[24px] h-[24px]"
								src={`${collapsed ? '/images/open_sider.svg' : '/images/close_sider.svg'}`}
								alt="menu-icon"
							/>
						</button>
					</div>
					{getSiderMenu()}
				</Sider>
			)}
		</ConfigProvider>
	);
};

export default withRouter(withTranslation()(observer(MainSider)));
