import React from 'react';
import { Button } from 'antd';
import { withTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import CoinIcon from '../../../../../../../components/CoinIcon';
import { useStore } from '../../../../../../../context/AppContext';

const BoughtCoinItemMobile = ({ t, className, boughtCoin, disableSell = false, onSell }) => {
	const { stateStore } = useStore();
	return (
		<div className={className}>
			<div className="flex justify-between items-center">
				<div className="flex">
					<div>
						<CoinIcon
							className="flex-[0_0_24px]"
							symbol={boughtCoin.symbol.replace('USDT', '').split('/')?.[0]}
							size={24}
							showAlt={false}
						/>
					</div>
					<span className="text-[14px] text-primary font-medium ml-2">{boughtCoin.symbol}</span>
				</div>
				<Button
					type="primary"
					className="button-primary--danger"
					onClick={() => onSell?.()}
					disabled={disableSell}
				>
					{t('sell')}
				</Button>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('bot')}`}</p>
				<p className="text-right">{boughtCoin.bot_name}</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('profit')}`}</p>
				<p>
					<span className="ms-auto fs-15 mb-0 font-w600">
						{stateStore.getCurrency(boughtCoin.pnl, boughtCoin.exchange_code)}
					</span>{' '}
					<span
						className={`ms-auto ${
							boughtCoin.pnl_percent > 0
								? 'text-green-02'
								: boughtCoin.pnl_percent < 0
								? 'text-red-01'
								: 'opacity-80'
						}`}
					>
						{`(${boughtCoin.pnl_percent}%)`}
					</span>
				</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('volume')}`}</p>
				<p>{parseFloat(boughtCoin.volume)}</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('bought_at')}`}</p>
				<p>{parseFloat(boughtCoin.bought_at)}</p>
			</div>
			<div className="flex justify-between">
				<p className="text-secondary">{`${t('time')}`}</p>
				<p>{dayjs.tz(parseInt(boughtCoin.timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss')}</p>
			</div>
		</div>
	);
};

export default withTranslation()(BoughtCoinItemMobile);
