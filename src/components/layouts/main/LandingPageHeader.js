import React, { useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import { withTranslation } from 'react-i18next';
import { themeObject } from '../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../context/ThemeContext';
import LanguageDropdown from '../../header/component/LanguageDropdown';

const { Header } = Layout;

const LandingPageHeader = ({ onNote, t, i18n }) => {
	const { typeTheme } = useContext(ThemeContext);

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
			<Header className={`px-6 shadow-lg shadow-${themeObject[typeTheme].background} sticky z-[1000] top-0`}>
				<div className="w-full flex items-center inline-flex justify-between">
					<div className="text-primary text-[22px] font-semibold">
						<div className="flex items-center justify-between px-[8px]">
							<div className="flex items-center gap-3">
								<img className="h-[48px] pl-[20px]" src="/images/logo.png" alt="Logo" />
							</div>
						</div>
					</div>
					<div className="flex inline-flex items-center space-x-6">
						<LanguageDropdown />
					</div>
				</div>
			</Header>
		</ConfigProvider>
	);
};

export default withRouter(withTranslation()(observer(LandingPageHeader)));
