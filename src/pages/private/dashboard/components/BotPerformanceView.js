import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Select, Tooltip, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import BotPerformanceChart from './BotPerformanceChart';
import botService from '../../../../services/BotService';
import Image from '../../../../components/Image';
import { getDateFromWeek, handleGetExchangeLogo } from '../../../../utils/helper';
import Loading from '../../../../components/Loading';
import { ThemeContext } from '../../../../context/ThemeContext';
import NoDataYetIcon from '../../../../assets/icons/NoDataYetIcon';

const PERIOD = [
	{ label: '1D', value: 'daily' },
	{ label: '1W', value: 'weekly' },
	{ label: '1M', value: 'monthly' },
];

const BotPerformanceView = ({ className, bots, period, ...props }) => {
	const { typeTheme } = useContext(ThemeContext);
	const { t } = useTranslation();
	const history = useHistory();
	const [selectedBot, setSelectedBot] = useState(null);
	const [dailyData, setDailyData] = useState([]);
	const [weeklyData, setWeeklyData] = useState([]);
	const [monthlyData, setMonthlyData] = useState([]);
	const [dailyLabels, setDailyLabels] = useState([]);
	const [weeklyLabels, setWeeklyLabels] = useState([]);
	const [monthlyLabels, setMonthlyLabels] = useState([]);
	const [currentPeriod, setCurrentPeriod] = useState(period.toLowerCase());
	const [currentInput, setCurrentInput] = useState('profit');
	const isMobile = useMediaQuery('(max-width: 768px)');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (bots) {
			setLoading(false);
			setSelectedBot(bots[0]);
		}
	}, [bots]);

	const fetchDailyChart = () => {
		botService
			.getBotProfitHis(selectedBot.id, 'daily', 30)
			.then(({ results }) => {
				let tmps = results.reverse();
				if (tmps.length === 1) {
					const m = dayjs(`${tmps[0].year}-${tmps[0].month}-${tmps[0].day}`).tz().add(-1, 'day');
					tmps = [
						{
							avg_est: 0,
							avg_profit: 0,
							day: m.date(),
							month: m.month() + 1,
							year: m.year(),
						},
						...results,
					];
				}

				setDailyData(
					tmps.map(({ avg_profit, avg_est }) => ({
						avg_profit,
						avg_est,
					}))
				);
				setDailyLabels(tmps.map(({ day, month, year }) => `${year}/${month}/${day}`));
			})
			.finally(() => setLoading(false));
	};

	const fetchWeeklyChart = () => {
		botService
			.getBotProfitHis(selectedBot.id, 'weekly', 52)
			.then(({ results }) => {
				let tmpsWeek = results.reverse();
				if (tmpsWeek.length === 1) {
					const m = dayjs.tz().year(tmpsWeek[0].year).week(tmpsWeek[0].week).add(-1, 'week');
					tmpsWeek = [{ avg_est: 0, avg_profit: 0, week: m.week(), year: m.year() }, ...results];
				}

				setWeeklyData(
					tmpsWeek.map(({ avg_profit, avg_est }) => ({
						avg_profit,
						avg_est,
					}))
				);
				setWeeklyLabels(tmpsWeek.map(({ week, year }) => getDateFromWeek(year, week)));
			})
			.finally(() => setLoading(false));
	};

	const fetchMonthlyChart = () => {
		botService
			.getBotProfitHis(selectedBot.id, 'monthly', 12)
			.then(({ results }) => {
				let tmpsMonth = results.reverse();
				if (tmpsMonth.length === 1) {
					const m = dayjs.tz().add(-1, 'month');
					tmpsMonth = [{ avg_est: 0, avg_profit: 0, month: m.month() + 1, year: m.year() }, ...results];
				}
				setMonthlyData(
					tmpsMonth.map(({ avg_profit, avg_est }) => ({
						avg_profit,
						avg_est,
					}))
				);
				setMonthlyLabels(tmpsMonth.map(({ month, year }) => `${year}/${month}/01`));
			})
			.finally(() => setLoading(false));
	};

	const fetchDataChart = (currentPeriod) => {
		switch (currentPeriod) {
			case 'weekly':
				fetchWeeklyChart();
				break;
			case 'monthly':
				fetchMonthlyChart();
				break;
			default:
				fetchDailyChart();
				break;
		}
	};

	useEffect(() => {
		if (selectedBot) {
			setLoading(true);
			fetchDataChart(currentPeriod);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBot, currentPeriod]);

	const getData = (period) => {
		switch (period) {
			case 'daily':
				return dailyData;
			case 'weekly':
				return weeklyData;
			default:
				return monthlyData;
		}
	};

	const getLabels = (period) => {
		switch (period) {
			case 'daily':
				return dailyLabels;
			case 'weekly':
				return weeklyLabels;
			default:
				return monthlyLabels;
		}
	};

	return (
		<div className={`flex flex-col card overflow-hidden relative ${className}`} {...props}>
			{bots?.length > 0 && (
				<div className="flex justify-between items-center">
					<div className="flex flex-row">
						<Select
							className={`${isMobile ? 'min-w-[150px]' : 'min-w-[250px]'} mr-1`}
							value={selectedBot?.id}
							onChange={(value) => {
								setSelectedBot(bots.find((bot) => bot.id === parseInt(value)));
							}}
							data-qa="performance-bot-select"
							popupClassName="bought-coin-bot-select md:min-w-[400px]"
							showSearch
							filterOption={(input, option) =>
								option.children?.toLowerCase().includes(input.toLowerCase())
							}
							options={[
								...bots.map((bot) => ({
									value: bot.id,
									children: bot.name,
									label: (
										<Tooltip
											color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'}
											title={bot.name}
											trigger={['hover']}
											placement="topLeft"
											open={bot.name?.length < 50 ? false : undefined}
										>
											<Image
												className="w-[18px] mr-2"
												src={handleGetExchangeLogo(bot.exchange_code)}
												alt=""
											/>
											{bot.name}
										</Tooltip>
									),
								})),
							]}
						/>

						<Select
							className="min-w-[70px]"
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

					{!isMobile ? (
						<Radio.Group
							buttonStyle="solid"
							className="period-styled"
							onChange={(e) => setCurrentPeriod(e.target.value)}
							defaultValue="daily"
							optionType="button"
							options={PERIOD.map(({ label, value }) => ({
								value,
								label: t(label),
							}))}
						/>
					) : (
						<Select
							className="min-w-[60px]"
							defaultValue="daily"
							onChange={(val) => setCurrentPeriod(val)}
							options={PERIOD.map(({ label, value }) => ({
								value,
								label: t(label),
							}))}
						/>
					)}
				</div>
			)}
			{bots && bots.length === 0 && (
				<div className="flex-1 flex flex-col justify-center items-center">
					<p>{t('no_bot')}</p>
					<Button
						className="button-primary w-[153px] flex items-center"
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => history.push(`/bots/my-bot/create`)}
					>
						{t('add_new_bot')}
					</Button>
				</div>
			)}
			{loading && (
				<div className="absolute inset-0 flex justify-center items-center h-full">
					<Loading />
				</div>
			)}
			{bots?.length > 0 && !loading && (
				<div
					className={`xxl:pl-[1.875rem] ${
						getData(currentPeriod).length > 0 &&
						getData(currentPeriod).findIndex((v) => parseInt(v) !== 0) !== -1
							? 'mt-4'
							: 'mt-[6rem]'
					}`}
				>
					<div className="grid grid-cols-1 gap-x-8">
						<div className="xxl:block">
							<div className="card-body p-0">
								{getData(currentPeriod).length > 0 &&
								getData(currentPeriod).findIndex((v) => parseInt(v) !== 0) !== -1 ? (
									<BotPerformanceChart
										data={getData(currentPeriod)}
										labels={getLabels(currentPeriod)}
										period={currentPeriod}
										inputValue={currentInput}
										exchangeCode={selectedBot?.exchange_code}
									/>
								) : (
									<div className="h-full flex items-center justify-center flex-col">
										<NoDataYetIcon />
										<span className="text-sm mt-3">{t('no_data_yet')}</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default BotPerformanceView;
