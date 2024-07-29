import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createChart } from 'lightweight-charts';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useStore } from '../../../../context/AppContext';
import { themeObject } from '../../../../styles/themes/themeVariables';
import NoDataYetIcon from '../../../../assets/icons/NoDataYetIcon';
import { getLocaleDatePicker } from '../../../../utils/helper';
import { panelRender } from '../../../../components/daterange/StyleWrapperRangePicker';
import exchangeService from '../../../../services/ExchangeService';

const { RangePicker } = DatePicker;

const AccountBalanceChart = ({ exchangeInfo }) => {
	const { t } = useTranslation();
	const { exchangeId } = useParams();
	const { stateStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const chartContainerRef = useRef(null);
	const [width, setWidth] = useState(0);
	const [balanceData, setBalanceData] = useState([]);
	const [balanceFilter, setBalanceFilter] = useState({
		time_range: [dayjs().subtract(30, 'days'), dayjs()],
	});

	const getPortfolio = () => {
		exchangeService
			.getExchangePortfolio(exchangeId, {
				report_type: 'daily',
				ordering: '-created',
				from_date: balanceFilter.time_range?.[0]?.startOf('day')?.unix(),
				to_date: balanceFilter.time_range?.[1]?.endOf('day')?.unix(),
				limit: 30,
			})
			.then(({ results }) => {
				setBalanceData(
					results.reverse().map(({ avg_asset, day, month, year, timestamp }) => ({
						value: avg_asset,
						type: dayjs.tz(parseInt(timestamp) * 1000 || `${year}-${month}-${day}`).format('YYYY-MM-DD'),
					}))
				);
			});
	};

	const formatDate = (dateString) => {
		if (dateString) {
			const parts = dateString.split('-');
			const year = parts[0] ? parts[0] : '2023';
			const month = parts[1]?.padStart(2, '0') ? parts[1]?.padStart(2, '0') : '01';
			const day = parts[2]?.padStart(2, '0') ? parts[2]?.padStart(2, '0') : '01';

			return `${year}-${month}-${day}`;
		}
		return '2023-06-06';
	};
	const formatChartData = (datas) => datas.map((item) => ({ ...item, time: formatDate(item.date) }));

	const chartDatas = useMemo(
		() =>
			formatChartData(
				balanceData.map(({ value, type }) => ({
					date: type,
					value,
				}))
			),
		[balanceData, stateStore.language, typeTheme]
	);

	useEffect(() => {
		const element = chartContainerRef.current;
		if (!element) return;
		const resizeObserver = new ResizeObserver(() => {
			setWidth(element?.clientWidth);
		});
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [chartContainerRef]);

	useEffect(() => {
		const chart = createChart(chartContainerRef?.current, {
			layout: {
				textColor: themeObject[typeTheme].colorTextChart,
				background: {
					type: 'solid',
					color: typeTheme === 'dark' ? '#1E1F25' : 'white',
				},
			},
			width,
			height: 362,
			rightPriceScale: {
				borderVisible: false,
				autoScale: true,
			},
			timeScale: {
				borderVisible: false,
				autoScale: true,
			},
			grid: {
				vertLines: {
					color: 'transparent',
				},
				horzLines: {
					color: themeObject[typeTheme].colorGridChart,
				},
			},
			theme: typeTheme,
			handleScroll: false,
			handleScale: false,
		});

		const handleResize = () => {
			chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
		};

		chart.timeScale().fitContent();

		const lineSeries = chart.addBaselineSeries({
			// baseValue: { type: 'percent', price: 0 },
			topLineColor: themeObject[typeTheme].colorLineChart,
			topFillColor1: 'rgba(155, 63, 255, 0.2)',
			topFillColor2: 'rgba(155, 63, 255, 0)',
			bottomLineColor: '#FA2256',
			bottomFillColor1: 'rgba(250, 34, 86, 0)',
			bottomFillColor2: 'rgba(250, 34, 86, 0.2)',
			lineWidth: 2,

			priceFormat: {
				type: 'custom',
				formatter(price) {
					return stateStore.getCurrency(price.toFixed(2) || 0, exchangeInfo?.exchange);
				},
			},
			priceScale: {
				width: 10,
			},
		});

		const filteredData = [];
		let prevValue = null;
		for (const point of chartDatas) {
			if (point.value !== 0 || prevValue !== 0) {
				filteredData.push(point);
			}
			prevValue = point.value;
		}
		lineSeries.setData(filteredData);

		window.addEventListener('resize', handleResize);

		// Clean up the chart when the component is unmounted
		return () => {
			window.removeEventListener('resize', handleResize);

			chart.remove();
		};
	}, [chartDatas, width]);

	useEffect(() => {
		getPortfolio();
	}, [balanceFilter]);

	return (
		<div className="card-primary mt-4">
			<div className="flex justify-between items-center gap-4">
				<p className="font-semibold text-lg text-primary">{t('Balance')}</p>
				<RangePicker
					getPopupContainer={(trigger) => trigger.parentElement}
					locale={getLocaleDatePicker(stateStore.language)}
					className="w-full xl:w-[300px]"
					popupClassName="w-screen md:w-fit"
					placeholder={[t('From date'), t('To date')]}
					format="DD-MM-YYYY"
					value={balanceFilter.time_range}
					onChange={(time_range) => setBalanceFilter({ ...balanceFilter, time_range })}
					panelRender={panelRender}
				/>
			</div>
			<div className="mt-8 h-[362px]">
				<div ref={chartContainerRef} className="TVChartContainer" />
				{balanceData.length > 0 && balanceData.findIndex((v) => parseInt(v) !== 0) !== -1 ? (
					// <div ref={chartContainerRef} className="TVChartContainer" />
					<div> </div>
				) : (
					<div className="h-full flex items-center justify-center opacity-60 flex-col">
						<NoDataYetIcon />
						<span className="text-sm">{t('no_data_yet')}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(AccountBalanceChart);
