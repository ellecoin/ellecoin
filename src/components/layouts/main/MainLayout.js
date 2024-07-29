import React, { useContext } from 'react';
import { ConfigProvider, Layout } from 'antd';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import { observer } from 'mobx-react';
import MainSider from './sider/MainSider';
import MainHeader from './MainHeader';
import MainFooter from './MainFooter';
import { ThemeContext } from '../../../context/ThemeContext';
import { themeObject } from '../../../styles/themes/themeVariables';
import { useStore } from '../../../context/AppContext';

const { Content } = Layout;

const MainLayout = ({ children }) => {
	const { authStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const isLGBigger = useMediaQuery('(min-width: 1024px)');
	const themeConfig = {
		components: {
			Input: {
				fontSize: 14,
				controlHeight: 40,
				borderRadius: 8,
			},
			InputNumber: {
				fontSize: 14,
				controlHeight: 40,
				borderRadius: 8,
				colorBorder: themeObject[typeTheme].borderColor,
			},
			Select: {
				fontSize: 14,
				borderRadius: 8,
				controlHeight: 40,
				colorBorder: themeObject[typeTheme].borderColor,
			},
			DatePicker: {
				fontSize: 14,
				borderRadius: 8,
				controlHeight: 40,
				colorBorder: themeObject[typeTheme].borderColor,
			},
			Button: {
				fontSize: 14,
				borderRadius: 8,
				controlHeight: 40,
				colorBorder: themeObject[typeTheme].borderColor,
			},
			Tooltip: {
				colorTextLightSolid: themeObject[typeTheme].textPrimary,
			},
		},
	};
	return (
		<Layout>
			<MainSider />
			<Content>
				<Layout className="relative min-h-screen">
					<MainHeader />
					<ConfigProvider theme={themeConfig}>
						<Content key={authStore?.user?.demo_mode} className={`${isLGBigger ? 'mt-8' : 'mt-4'} mb-20`}>
							{children}
						</Content>
					</ConfigProvider>
					<MainFooter />
				</Layout>
			</Content>
		</Layout>
	);
};

export default observer(MainLayout);
