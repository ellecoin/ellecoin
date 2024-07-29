import React, { useContext, useEffect, useState } from 'react';
import { List, Skeleton, Badge } from 'antd';
import { withTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import { Converter } from 'showdown';

import userService from '../../../../services/UserService';
import { useStore } from '../../../../context/AppContext';
import Loading from '../../../../components/Loading';
import NotificationDetailModal from './NotificationDetailModal';
import BotIcon from '../../../../assets/icons/BotIcon';
import { SocketContext } from '../../../../context/SocketContext';

const markdownConverter = new Converter({
	moreStyling: true,
	literalMidWordUnderscores: true,
});

const Notification = ({ t }) => {
	const { authStore, stateStore } = useStore();
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [data, setData] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [loading, setLoading] = useState(true);
	const { notificationData } = useContext(SocketContext);
	const loadData = (page, isChangeLanguage = false) =>
		userService.getNotifications({ offset: (page - 1) * 10, limit: 10 }).then(({ count, results }) => {
			setTotal(count);
			if (isChangeLanguage) {
				setData([...results]);
			} else {
				setData([...data, ...results]);
			}
			const unreadCount = results.reduce((result, { unread }) => {
				if (unread) {
					return result + 1;
				}
				return result;
			}, 0);
			authStore.setUnreadNotifyCount(Math.max(authStore.unreadNotifyCount, unreadCount));
		});

	const loadMoreData = () => {
		setPage(page + 1);
		return loadData(page + 1);
	};

	useEffect(() => {
		loadData(page).then(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (notificationData) {
			setData([notificationData, ...data]);

			// const unreadCount = results.reduce((result, { unread }) => {
			// 	if (unread) {
			// 		return result + 1;
			// 	}
			// 	return result;
			// }, 0);
			// authStore.setUnreadNotifyCount(Math.max(authStore.unreadNotifyCount, unreadCount + 1));
		}
	}, [notificationData]);

	// if (loading && data?.length === 0) {
	// 	return (
	// 		<div className="w-screen w-[330px] md:w-[400px] h-[400px] flex items-center justify-center">
	// 			<Loading />
	// 		</div>
	// 	);
	// }
	// if (data?.length === 0) {
	// 	return (
	// 		<div className="w-screen w-[330px] md:w-[400px] h-[400px] flex items-center justify-center">
	// 			{t('no_notification_message')}
	// 		</div>
	// 	);
	// }
	useEffect(() => {
		setLoading(true);
		setPage(1);
		setData([]);
		loadData(1, true).then(() => setLoading(false));
	}, [stateStore.language]);
	return (
		<div className="notification w-[330px] lg:w-[356px] h-[600px] relative">
			<div className="flex justify-between">
				<div className="inline-flex items-center gap-1">
					<p className="text-primary text-[12px]">{t('Your notifications')}</p>
					<Badge
						style={{ color: 'white' }}
						className="text-white"
						showZero={false}
						color={authStore.unreadNotifyCount > 0 ? '#FA2256' : ''}
						count={authStore.unreadNotifyCount}
					/>
				</div>
				<a
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						authStore
							.markAllNotifyAsRead()
							.then(() => setData(data.map((notify) => ({ ...notify, unread: false }))));
					}}
					className="link-primary pr-[15px] text-[12px] text-[#2180f8]"
				>
					{t('mark_all_as_read')}
				</a>
			</div>
			<div
				id="scrollableDiv"
				className="mt-[10px] h-[500px]"
				style={{
					overflow: 'auto',
				}}
			>
				{loading ? (
					<div className="flex items-center justify-center h-full w-full">
						<Loading />
					</div>
				) : (
					<InfiniteScroll
						dataLength={data.length}
						next={loadMoreData}
						hasMore={data.length < total}
						loader={
							<Skeleton
								avatar
								paragraph={{
									rows: 1,
								}}
								active
							/>
						}
						scrollableTarget="scrollableDiv"
					>
						<List
							dataSource={data}
							renderItem={(item, index) => (
								<List.Item key={index}>
									<List.Item.Meta
										avatar={
											<div className="card-item-avatar">
												<BotIcon width={24} height={24} />
											</div>
										}
										title={
											<Badge
												color="#FA2256"
												dot={item.unread}
												className="w-full"
												status="error"
												offset={[0, 10]}
											>
												<p className="mb-0 text-primary text-[14px] font-medium truncate w-full">
													{item.verb}
												</p>
											</Badge>
										}
										description={
											<div className="text-secondary text-[12px]">
												<div
													className="mb-2 text-primary line-clamp"
													dangerouslySetInnerHTML={{
														__html: markdownConverter.makeHtml(item.description),
													}}
												/>
												<span>
													{dayjs
														.tz(parseInt(item.timestamp) * 1000)
														.format('DD-MM-YYYY HH:mm:ss')}
												</span>
											</div>
										}
										onClick={() => {
											if (item.unread) {
												authStore
													.markNotifyAsRead(item.slug)
													.then(() =>
														setData(
															data.map((notify) =>
																notify.id === item.id
																	? { ...notify, unread: false }
																	: notify
															)
														)
													);
											}
											setSelectedItem(item);
										}}
									/>
								</List.Item>
							)}
						/>
					</InfiniteScroll>
				)}
			</div>
			<div className="absolute bottom-0 w-full pr-[15px]">
				<button className="btn-read-more cursor-pointer link-primary text-[12px]">
					{t('notification_unread_description', {
						count: authStore.unreadNotifyCount,
					})}
				</button>
			</div>
			{!!selectedItem && (
				<NotificationDetailModal
					open={!!selectedItem}
					notification={selectedItem}
					onClose={() => setSelectedItem(null)}
				/>
			)}
		</div>
	);
};

export default withTranslation()(Notification);
