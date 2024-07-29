import React, { useContext, useEffect, useState } from 'react';
import { Badge, Popover } from 'antd';
import { withTranslation } from 'react-i18next';

import { useStore } from '../../../context/AppContext';
import NotificationIcon from '../../../assets/icons/NotificationIcon';
import { BASE_COLORS } from '../../../styles/themes/constants';
import { ThemeContext } from '../../../context/ThemeContext';
import { SocketContext } from '../../../context/SocketContext';
import Notification from '../../../pages/private/users/components/Notification';

const NotificationDropdown = ({ i18n }) => {
	const { authStore, stateStore } = useStore();
	const [isOpened, setOpened] = useState(false);
	const { typeTheme } = useContext(ThemeContext);
	const [unreadNotifyCount, setUnreadNotifyCount] = useState(0);
	const { notificationData } = useContext(SocketContext);
	useEffect(() => {
		setUnreadNotifyCount(authStore.getUnreadNotifyCount());
	}, [notificationData]);
	return (
		<Popover
			getPopupContainer={(trigger) => trigger.parentElement}
			overlayClassName="pt-4 px-4 styledNotification"
			trigger="click"
			placement="bottom"
			content={<Notification />}
			onOpenChange={setOpened}
			arrow={false}
		>
			<Badge style={{ color: 'white' }} count={authStore.getUnreadNotifyCount()}>
				<button className="border-none">
					<NotificationIcon color={typeTheme === 'dark' ? BASE_COLORS.white : '#34384C'} />
				</button>
			</Badge>
		</Popover>
	);
};

export default withTranslation()(NotificationDropdown);
