import { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Select } from 'antd';
import ArrowIcon from '../../../../../../../assets/icons/ArrowIcon';
import BotService from '../../../../../../../services/BotService';
import { PERIOD_LIST } from '../../../helper';
import { getDateFromWeek } from '../../../../../../../utils/helper';
import BotPerformanceChart from './BotPerformanceChart';
import NoDataYetIcon from '../../../../../../../assets/icons/NoDataYetIcon';
import { useStore } from '../../../../../../../context/AppContext';

// Profit: % ; EST: $
const BotPerformanceView = ({ t, botInfo }) => {
	const { botId } = useParams();
	const [loading, setLoading] = useState(false);
	const [displayData, setDisplayData] = useState({});
	const [data, setData] = useState([]);
	const [labels, setLabels] = useState([]);
	const [currentPeriod, setCurrentPeriod] = useState('daily');
	const [currentInput, setCurrentInput] = useState('profit');
	const { stateStore } = useStore();

	const getBotProfitHistory = () => {
		setDisplayData({});
		setLoading(true);
		const limit = () => {
			if (currentPeriod === 'daily') {
				return 30;
			}
			if (currentPeriod === 'weekly') {
				return 52;
			}
			if (currentPeriod === 'monthly') {
				return 12;
			}
			return 3; // yearly
		};
		BotService.getBotProfitHis(botId, currentPeriod, limit())
			.then(({ results }) => {
				let tmps = results.reverse();

				if (tmps.length === 1) {
					if (currentPeriod === 'daily') {
						const m = dayjs(`${tmps[0].year}-${tmps[0].month}-${tmps[0].day}`).tz().add(-1, 'day');
						tmps = [
							{
								avg_profit: 0,
								day: m.date(),
								month: m.month() + 1,
								year: m.year(),
							},
							...results,
						];
					} else if (currentPeriod === 'weekly') {
						tmps = [
							{
								avg_profit: 0,
								week: results[0].week - 1,
								year: results[0].year,
							},
							...results,
						];
					} else if (currentPeriod === 'monthly') {
						const m = dayjs.tz().add(-1, 'month');
						tmps = [{ avg_profit: 0, month: m.month() + 1, year: m.year() }, ...results];
					} else if (currentPeriod === 'yearly') {
						const m = dayjs.tz().add(-1, 'year');
						tmps = [{ avg_profit: 0, year: m.year() }, ...results];
					}
				}

				setData(
					tmps.map(({ avg_profit, avg_est }) => ({
						avg_profit,
						avg_est,
					}))
				);

				setLabels(
					tmps.map(({ day, month, week, year }) => {
						switch (currentPeriod) {
							case 'weekly':
								return getDateFromWeek(year, week);
							case 'monthly':
								return `${year}/${month}/01`;
							case 'yearly':
								return `${year}/01/01`;
							default:
								return `${year}/${month}/${day}`;
						}
					})
				);

				setDisplayData({
					est: tmps[tmps.length - 1]?.avg_est - (tmps[tmps.length - 2]?.avg_est || 0),
					profit: tmps[tmps.length - 1]?.avg_profit - tmps[tmps.length - 2]?.avg_profit,
				});
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		if (botInfo?.id) {
			getBotProfitHistory();
		}
	}, [currentPeriod]);

	return (
		<div className="card-primary">
			<div className="text-[16px] text-primary mb-2">
				{currentInput === 'profit' ? (
					<>
						{t('Cumulative PNL(%)')}
						<span
							className={`font-medium text-[14px] ${
								data[data.length - 1]?.avg_profit > 0 ? 'text-[#30E0A1] ml-2' : 'text-[#FA2256] ml-2'
							}`}
						>
							{data[data.length - 1]?.avg_profit}%
						</span>
					</>
				) : (
					<>
						{t('Cumulative PNL($)')}
						<span
							className={`font-medium text-[14px] ${
								data[data.length - 1]?.avg_est > 0 ? 'text-[#30E0A1] ml-2' : 'text-[#FA2256] ml-2'
							}`}
						>
							{data[data.length - 1]?.avg_est}$
						</span>
					</>
				)}

				<Select
					className="min-w-[70px] ml-2"
					defaultValue="profit"
					onChange={(value) => setCurrentInput(value)}
					data-qa="performance-bot-select-currency"
					popupClassName="bought-coin-bot-select"
					options={[
						{ label: 'PNL (%)', value: 'profit' },
						{ label: 'PNL ($)', value: 'est' },
					]}
				/>
			</div>
			<div className="flex justify-between items-center">
				{currentInput === 'profit' ? (
					<p
						className={`font-medium text-[14px] fs-13 ${
							displayData?.profit > 0 ? 'text-[#30E0A1]' : ' text-[#FA2256]'
						} flex gap-2 items-center`}
					>
						<ArrowIcon type={`${displayData?.profit > 0 ? 'up' : 'down'}`} />
						{`${parseFloat(displayData?.profit || 0).toFixed(2)}%`}
					</p>
				) : (
					<p
						className={`text-primary mb-0 text-[16px] ${
							displayData?.est > 0 ? 'text-[#30E0A1]' : ' text-[#FA2256]'
						} flex gap-2 items-center`}
					>
						<ArrowIcon type={`${displayData?.est > 0 ? 'up' : 'down'}`} />
						{stateStore.getCurrency(displayData.est || 0, botInfo?.my_exchange?.exchange_code)}
					</p>
				)}
				<div className="flex gap-3 ml-[1.25rem] py-2">
					{PERIOD_LIST.map((period) => (
						<button
							key={period.value}
							className={`rounded-[50px] hidden md:block px-4 py-2 ${
								currentPeriod === period.value ? 'button-primary--active' : 'button-primary--inactive'
							}`}
							onClick={() => setCurrentPeriod(period.value)}
						>
							<span className="text-[14px]font-semibold">{t(period.label)}</span>
						</button>
					))}
				</div>
			</div>
			<div className="h-[486px] mt-4 mb-4">
				{data.length > 0 &&
					data.findIndex(({ avg_profit }) => parseFloat(avg_profit) !== 0) !== -1 &&
					!loading && (
						<BotPerformanceChart
							data={data}
							labels={labels}
							type={currentInput}
							exchangeCode={botInfo.my_exchange.exchange_code}
						/>
					)}

				{(data.length === 0 || data.findIndex(({ avg_profit }) => avg_profit !== 0) === -1) && !loading && (
					<div className="h-full flex items-center justify-center flex-col">
						<NoDataYetIcon />
						<span className="text-sm mt-3">{t('no_data_yet')}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default observer(withTranslation()(BotPerformanceView));
