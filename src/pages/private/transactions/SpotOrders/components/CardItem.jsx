import React from 'react';
import { withTranslation } from 'react-i18next';
import { Divider } from 'antd';
import { useStore } from '../../../../../context/AppContext';
import { renderDateTimeTable } from '../../../../../utils/helper';

const CardItem = ({ dataItem, t }) => {
	const {
		id,
		coin,
		created,
		cost: total,
		bot_name,
		executed_qty,
		fee_cost: fee,
		fee_currency,
		price,
		profit,
		side,
		est,
		exchange_code,
	} = dataItem;
	const { stateStore } = useStore();

	const renderCoin = () => <span className="text-table-body">{coin}</span>;
	const renderBot = () => <span className="text-table-body">{bot_name}</span>;
	const renderSide = () => (
		<span className={`${side === 'SELL' ? 'text-[#FA2256]' : 'text-[#30E0A1]'} text-table-body`}>
			{t(side.toLowerCase()).toUpperCase()}
		</span>
	);
	const renderExecuted = () => <span className="text-table-body">{executed_qty}</span>;
	const renderPrice = () => <span className="text-table-body">{parseFloat(price)}</span>;
	const renderProfit = () => (
		<div className="flex flex-row items-center text-table-body">
			{side === 'SELL' ? (
				<>
					<span
						className={
							parseFloat(profit) > 0
								? 'text-green-02 text-[14px]'
								: parseFloat(profit) < 0
								? 'text-red-01 text-[14px]'
								: ''
						}
					>
						{`${profit > 0 ? '+' : '-'}${profit}%`}
					</span>
					<span className="font-normal text-primary ml-1">
						{stateStore.getCurrency(est || 0, exchange_code)}
					</span>
				</>
			) : (
				<span className="text-start">-</span>
			)}
		</div>
	);
	const renderTradeFee = () => (
		<span className="text-table-body">
			{parseFloat(fee)} {fee_currency}
		</span>
	);
	const renderTotal = () => (
		<span className="text-table-body">
			{parseFloat(total)} {coin.split('/')[1] || 'USDT'}
		</span>
	);
	const renderCreated = () => renderDateTimeTable(created);

	const infoItem = [
		{ label: 'coin', itemRender: renderCoin(), id: 'coin' },
		{ label: 'bot', itemRender: renderBot(), id: 'bot' },
		{ label: 'side', itemRender: renderSide(), id: 'side' },
		{ label: 'Executed', itemRender: renderExecuted(), id: 'executed' },
		{ label: 'price', itemRender: renderPrice(), id: 'price' },
		{ label: 'profit', itemRender: renderProfit(), id: 'profit' },
		{ label: 'Trading fee', itemRender: renderTradeFee(), id: 'tradingFee' },
		{ label: 'total', itemRender: renderTotal(), id: 'total' },
		{ label: 'created', itemRender: renderCreated(), id: 'created' },
	];

	return (
		<div key={id} className="gap-4 mb-4 flex flex-col text-[14px]">
			{(infoItem || []).map((i) => (
				<div className="flex flex-row items-center justify-between" key={i.id}>
					<p className="text-[12px]">{t(i.label)}</p>
					{i.itemRender}
				</div>
			))}
			<Divider className="my-2" />
		</div>
	);
};

export default withTranslation()(CardItem);
