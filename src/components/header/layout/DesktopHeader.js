import React, { useContext, useState, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react';
import { withRouter, useLocation, useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Switch, Tag } from 'antd';
// import ThemeSelect from '../component/ThemeSelect';
import LanguageDropdown from '../component/LanguageDropdown';
import ProfileDropdown from '../component/ProfileDropdown';
import NotificationDropdown from '../component/NotificationDropdown';
import { useStore } from '../../../context/AppContext';
import ArrowLeftIcon from '../../../assets/icons/ArrowLeftIcon';
import { ThemeContext } from '../../../context/ThemeContext';

const DesktopHeader = ({ t, iconSupport, headerName }) => {
	const { stateStore, authStore } = useStore();
	const [loading, setLoading] = useState(false);
	const { typeTheme } = useContext(ThemeContext);
	const [backIcon, setBackIcon] = useState(iconSupport);
	const location = useLocation();
	const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
	const activeTab = query.get('type') || 'fixed';
	const history = useHistory();

	const onGoBack = () => {
		history.replace(`/presets?type=${activeTab}`);
		setBackIcon(null);
	};

	const updateAccountMode = (event) => {
		setLoading(true);
		stateStore.setDemoMode(event);
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	};

	useEffect(() => {
		if (location.pathname.includes('/presets/create')) {
			const renderIcon = (
				<ArrowLeftIcon
					className="hover:cursor-pointer relative right-[13px]"
					width={24}
					height={24}
					color={typeTheme === 'dark' ? '#FFFFFF' : '#B2B3B5'}
					onClick={() => onGoBack()}
				/>
			);
			setBackIcon(renderIcon);
		} else setBackIcon(null);
	}, [location.pathname, stateStore.language, typeTheme, t]);

	return (
		<div className="w-full flex items-center justify-between">
			<div className="flex flex-row items-center gap-2 text-primary text-[22px] font-semibold">
				{backIcon}
				{stateStore.headerTitle ||
					(headerName.join(' ').length === 0
						? t('home_title')
						: headerName.join(' ') === 'dashboard dark'
						? t('home_title')
						: t(headerName.join('-')))}
			</div>
			<div className="flex flex-row items-center gap-2 text-primary text-[14px]">
				<span>{t('Demo Account')} </span>
				<Switch
					disabled={loading}
					checked={stateStore.demoMode}
					defaultValue={stateStore.demoMode}
					loading={loading}
					onChange={updateAccountMode}
				/>
				{stateStore.demoMode && (
					<Tag
						color="#FFB800"
						className="flex items-center justify-center h-[36px] w-[140px] text-[16px] font-medium"
					>
						{t('Test Data')}
					</Tag>
				)}
			</div>
			<div className="flex items-center space-x-6">
				<LanguageDropdown />
				{/* <ThemeSelect /> */}
				<NotificationDropdown />
				<ProfileDropdown />
			</div>
		</div>
	);
};

export default withRouter(withTranslation()(observer(DesktopHeader)));
