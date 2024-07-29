import { Button, Checkbox, Divider } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BotService from '../../../../../services/BotService';
import StateStore from '../../../../../stores/StateStore';

const ChooseStopBotType = ({ onClose, onOk, selectedBots = [] }) => {
	const { t } = useTranslation();
	const [sellAll, setSellAll] = useState(true);
	const [pnlData, setPnlData] = useState({});

	useEffect(() => {
		BotService.caculatePNLInBulk({ bots_id: selectedBots })
			.then((res) => setPnlData(res))
			.catch((err) => console.log(err));
	}, [selectedBots]);

	return (
		<div>
			<div>
				<Checkbox checked={!sellAll} className="font-medium" onChange={() => setSellAll(false)}>
					<span className="text-[14px]">{t('Delete all orders and keep the coins')}</span>
					<br />
					<span className="text-[12px] text-secondary">{t('delete_all_modal_description')}</span>
					<div className="mt-2 text-[12px] text-secondary">
						{t('Bot profit')} :{' '}
						{StateStore.getCurrency(
							parseFloat(pnlData.est_no_holdings) || 0,
							pnlData.my_exchange?.exchange_code
						)}
						/{' '}
						<span
							className={
								pnlData.profit_no_holdings > 0
									? 'text-green-02'
									: pnlData.profit_no_holdings < 0
									? 'text-red-01'
									: ''
							}
						>
							{pnlData.profit_no_holdings}%
						</span>
					</div>
				</Checkbox>
				<Divider />
				<Checkbox checked={sellAll} className="font-medium" onChange={() => setSellAll(true)}>
					<span className="text-[14px]">{t('Sell all orders at market price')}</span>
					<br />
					<span className="text-[12px] text-secondary">{t('sell_all_modal_description')}</span>
					<div className="mt-2 text-[12px] text-secondary">
						{t('Bot profit')} :{' '}
						{StateStore.getCurrency(parseFloat(pnlData.est) || 0, pnlData.my_exchange?.exchange_code)}/{' '}
						<span
							className={pnlData.profit > 0 ? 'text-green-02' : pnlData.profit < 0 ? 'text-red-01' : ''}
						>
							{pnlData.profit}%
						</span>
					</div>
				</Checkbox>
			</div>
			<Divider />

			<div className="text-right flex justify-end gap-2">
				<Button className="button-primary-outline--default" onClick={onClose}>
					{t('no')}
				</Button>

				<Button className="button-primary" onClick={() => onOk(sellAll)}>
					{t('yes')}
				</Button>
			</div>
		</div>
	);
};

export default memo(ChooseStopBotType);
