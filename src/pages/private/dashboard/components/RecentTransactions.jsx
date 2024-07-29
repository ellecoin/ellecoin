import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import BotService from '../../../../services/BotService';
import Loading from '../../../../components/Loading';
import ArrowRightIcon from '../../../../assets/icons/ArrowRightIcon';
import CoinIcon from '../../../../components/CoinIcon';

const RecentTransactions = () => {
	const { t } = useTranslation();
	const [transactionLoading, setTransactionLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		setTransactionLoading(true);
		BotService.getOrderHistory({ limit: 3, offset: 0 })
			.then(({ count, results }) => {
				setTransactionLoading(false);
				setTransactions(results);
			})
			.catch(() => {
				setTransactionLoading(false);
			});
	}, []);

	return (
		<div className="card-primary gap-4 mt-4 grid grid-cols-1">
			<div className="flex justify-between">
				<div className="flex flex-col p-[10px] w-100">
					<h1 className="text-primary text-[16px] font-semibold leading-6">{t('Recent Transaction')}</h1>
					<p className="text-secondary text-[14px] leading-5 mt-1">{t('Calculated by latest activity')}</p>
				</div>
			</div>
			<div className="grid grid-cols-1">
				{transactionLoading && (
					<div className=" flex justify-center items-center h-full w-full">
						<Loading />
					</div>
				)}
				<Divider className="m-0" />
				{transactions.map(({ coin, side, cost, created }, i) => (
					<div key={i}>
						<div className="flex justify-between py-4 space-x-[10px]" key={i}>
							<div>
								<CoinIcon symbol={coin.split('/')[0]} size={42} />
							</div>
							<div className="flex-1 space-y-2">
								<p className="text-primary font-medium text-[14px]">{coin}</p>
								<p className={`${side === 'SELL' ? 'text-red-01' : 'text-green-02'} text-[14px] `}>
									{side}
								</p>
								<p className="text-primary text-[12px]">{`${parseFloat(cost)} ${
									coin.split('/')[1] || 'USDT'
								}`}</p>
							</div>
							<div className="text-secondary text-[14px]">
								{dayjs.tz(created * 1000).format('DD/MM/YYYY')}
							</div>
						</div>
						<Divider className="m-0" />
					</div>
				))}
			</div>
			<div className="flex pt-3">
				<Link className="link-primary text-[14px] flex items-center" to="/transactions">
					{t('View All Transaction')}
					<span className="ml-2">
						<ArrowRightIcon />
					</span>
				</Link>
			</div>
		</div>
	);
};

export default memo(RecentTransactions);
