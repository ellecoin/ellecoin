import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
// import ThemeSelect from '../component/ThemeSelect';
import LanguageDropdown from '../component/LanguageDropdown';
import ProfileDropdown from '../component/ProfileDropdown';
import NotificationDropdown from '../component/NotificationDropdown';
import { ThemeContext } from '../../../context/ThemeContext';
import { useStore } from '../../../context/AppContext';

const MobileHeader = ({ t, headerName }) => {
	const { collapsed, openSider } = useContext(ThemeContext);
	const { Text } = Typography;
	const { stateStore } = useStore();
	return (
		<div className="w-full flex items-center justify-between">
			<div className="flex flex-row items-center gap-2">
				<Button
					className="button-icon"
					type="text"
					icon={<MenuOutlined />}
					onClick={() => openSider(!collapsed)}
				/>
				<Text
					className="text-primary text-[16px] font-semibold"
					style={{
						width: 150,
					}}
					ellipsis
				>
					{stateStore.headerTitle ||
						(headerName.join(' ').length === 0
							? t('home')
							: headerName.join(' ') === 'dashboard dark'
							? t('home')
							: t(headerName.join('-')))}
				</Text>
			</div>
			<div className="flex items-center space-x-3">
				<LanguageDropdown />
				{/* <ThemeSelect /> */}
				<NotificationDropdown />
				<ProfileDropdown />
			</div>
		</div>
	);
};

export default withRouter(withTranslation()(observer(MobileHeader)));
