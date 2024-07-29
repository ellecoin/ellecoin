import React, { useState } from 'react';
import { Avatar, Divider, Popover, Tag, Switch } from 'antd';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import { useStore } from '../../../context/AppContext';
import ChangePasswordModal from '../../../pages/private/users/components/ChangePasswordModal';
import SettingIcon from '../../../assets/icons/SettingIcon';
import UnlockIcon from '../../../assets/icons/UnlockIcon';
import LogoutIcon from '../../../assets/icons/LogoutIcon';

const ProfileDropdown = ({ t }) => {
	const { authStore, stateStore } = useStore();
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [open, setOpen] = useState(false);
	const [editPass, setEditPass] = useState(false);
	const isMobile = useMediaQuery('(max-width: 768px)');

	const onClick = (key) => {
		setOpen(!open);
		switch (key) {
			case 'profile':
				return history.push('/user/profile');
			case 'change_password':
				return setEditPass(true);
			case 'logout':
				return handleLogout();
			default:
		}
	};

	const updateAccountMode = (event) => {
		setLoading(true);
		stateStore.setDemoMode(event);
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	};

	const handleLogout = () => {
		authStore.logout();
		history.replace('/login');
	};

	const content = (
		<div className="px-[6px] py-[8px]">
			{isMobile ? (
				<div className="flex flex-row justify-center items-center gap-2 text-primary text-[14px] mb-2.5">
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
							className="flex items-center justify-center h-[30px] text-[14px] font-medium"
						>
							{t('Test Data')}
						</Tag>
					)}
				</div>
			) : null}
			<div className="flex justify-between items-start mb-4">
				<Avatar size={40} src={authStore.user?.avatar?.thumb_image_url} />
				<div className="grow ml-2 mr-4">
					<p className="text-primary">{authStore.user?.user_name}</p>
					<p className="text-secondary">{authStore.user?.email}</p>
				</div>
			</div>
			<Divider className="m-0" />
			<div className="menu-primary">
				<div
					className="flex items-center py-4 px-2 menu-item cursor-pointer"
					onClick={() => onClick('profile')}
				>
					<SettingIcon />
					<span className="ml-[18px]">{t('profile')}</span>
				</div>
				<Divider className="m-0" />
				<div
					className="flex items-center py-4 px-2 menu-item cursor-pointer"
					onClick={() => onClick('change_password')}
				>
					<UnlockIcon />
					<span className="ml-[18px]">{t('change_password')}</span>
				</div>
				<Divider className="m-0" />
				<div className="flex items-center py-4 px-2 menu-item cursor-pointer" onClick={() => onClick('logout')}>
					<LogoutIcon />
					<span className="ml-[18px]">{t('logout')}</span>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<Popover
				getPopupContainer={(trigger) => trigger.parentElement}
				overlayClassName="px-4"
				open={open}
				onOpenChange={() => setOpen(!open)}
				trigger="click"
				placement="bottom"
				content={content}
				arrow={false}
			>
				<div className="cursor-pointer h-full">
					<Avatar style={{ border: 0 }} size={40} src={authStore.user?.avatar?.thumb_image_url} />
				</div>
			</Popover>
			<ChangePasswordModal open={editPass} onClose={() => setEditPass(false)} />
		</>
	);
};

export default withTranslation()(ProfileDropdown);
