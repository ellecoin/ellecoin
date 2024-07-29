import React, { useContext } from 'react';

import { withTranslation } from 'react-i18next';
import Last30DayIcon from '../../../../assets/icons/Last30DayIcon';
import DailyPnlIcon from '../../../../assets/icons/DailyPnlIcon';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useStore } from '../../../../context/AppContext';

const BalanceReportView = ({ t, exchangeInfo }) => {
	const { typeTheme } = useContext(ThemeContext);
	const { stateStore } = useStore();
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
			<div className="rounded-2xl items-center py-7 flex flex-col gap-y-3 card-primary">
				<div className="flex justify-center rounded-full p-3 ">
					<DailyPnlIcon typeTheme={typeTheme} />
				</div>

				<p className="text-primary text-[18px] font-semibold">
					{stateStore.getCurrency(exchangeInfo?.portfolio_pnl || 0, exchangeInfo?.exchange)} /{' '}
					{exchangeInfo?.portfolio_pnl_percent || 0}%
				</p>
				<p className="text-secondary text-[14px]">{t('Daily PnL')}</p>
			</div>
			<div className="rounded-2xl items-center py-7 flex flex-col gap-y-3 card-primary">
				<div className="flex justify-center rounded-full p-3">
					<Last30DayIcon typeTheme={typeTheme} />
				</div>

				<p className="text-primary text-[18px] font-semibold">
					{stateStore.getCurrency(exchangeInfo?.portfolio_thirty_days_pnl || 0, exchangeInfo?.exchange)} /{' '}
					{exchangeInfo?.portfolio_thirty_days_pnl_percent || 0}%
				</p>
				<p className="text-secondary text-[14px]">{t('Last 30 day')}</p>
			</div>
		</div>
	);
};

export default withTranslation()(BalanceReportView);
