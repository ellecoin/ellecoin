import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import OrderHistory from './pages/OrderHistory';

const SpotOrder = () => {
	const { t } = useTranslation();
	const onTabChange = () => {};

	const { search } = useLocation();
	const queryParams = useMemo(() => new URLSearchParams(search), [search]);

	const tabItems = useMemo(
		() => [
			{
				key: 'spotOrderHistory',
				label: <span>{t('Order History')}</span>,
				children: <OrderHistory />,
			},
		],
		[t]
	);

	return (
		<div className="card-primary mx-4 md:mx-8">
			<Tabs
				activeKey={queryParams.get('type') || 'spotOrderHistory'}
				defaultActiveKey="spotOrderHistory"
				items={tabItems}
				onChange={onTabChange}
			/>
		</div>
	);
};

export default SpotOrder;
