import { useEffect, useState, useMemo } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useParams, useLocation } from 'react-router-dom';
import BotService from '../../../../../../services/BotService';
import HoldingCoin from './components/HoldingCoin';
import BotDailyPNLChart from '../../../components/BotDailyPNL';
import BotPerformanceView from './components/BotPerformanceView';

const OverView = ({ t, botInfo }) => {
	const { botId } = useParams();
	const { search } = useLocation();
	const searchParams = useMemo(() => new URLSearchParams(search), [search]);
	const isBotTemplate = useMemo(() => searchParams.get('detail-template'), [searchParams]);
	const [pnlData, setPnlData] = useState([]);

	useEffect(() => {
		BotService.getBotPnl(botId).then(({ results }) => {
			setPnlData(
				results.reverse().map(({ pnl_est, pnl_percent, day, month, year }) => ({
					type: `${year}-${month}-${day}`,
					value: parseFloat(pnl_est),
					percent: parseFloat(pnl_percent),
				}))
			);
		});
	}, [botId]);

	return (
		<div className="space-y-4">
			<BotPerformanceView botInfo={botInfo} />

			<div className="card-primary">
				<div className="text-[16px] text-primary">{t('Daily PNL (%)')}</div>
				<div className="h-[486px] mt-4 mb-4">
					{pnlData.length > 0 && pnlData.findIndex(({ value }) => value !== 0) !== -1 ? (
						<BotDailyPNLChart data={pnlData} />
					) : (
						<div className="h-full flex items-center justify-center opacity-60">
							<span className="text-sm">{t('no_data_yet')}</span>
						</div>
					)}
				</div>
			</div>

			{!isBotTemplate ? (
				<div className="card-primary">
					<HoldingCoin />
				</div>
			) : null}
		</div>
	);
};

export default observer(withTranslation()(OverView));
