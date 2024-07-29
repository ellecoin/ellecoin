import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { createChart } from 'lightweight-charts';
import { useStore } from '../../../../context/AppContext';
import { ThemeContext } from '../../../../context/ThemeContext';
import { themeObject } from '../../../../styles/themes/themeVariables';
import { getPreviousDays } from '../../../../utils/datetime';

const FEW_COLUMN_QLT = 10;

const BotDailyPNLChart = ({ data }) => {
	const { stateStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const chartContainerRef = useRef(null);
	const [width, setWidth] = useState(0);

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

	const chartDatas = useMemo(() => {
		const currentDataLength = data?.length;
		let chartData = data;
		if (currentDataLength < FEW_COLUMN_QLT && currentDataLength > 0) {
			chartData = [
				...getPreviousDays(FEW_COLUMN_QLT - data?.length, data[0]?.type).map((data) => ({
					type: data,
					value: 0,
					percent: 0,
				})),
				...data,
			];
		}

		return formatChartData(
			chartData.map(({ value, type, percent }) => ({
				date: type,
				value: percent,
				color: percent >= 0 ? '#30E0A1' : '#FA2256',
			}))
		);
	}, [data, stateStore.language, typeTheme]);

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
			height: 486,
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

		const histogramSeries = chart.addHistogramSeries({
			priceFormat: {
				type: 'custom',
				formatter(price) {
					return `${price.toFixed(2)}%`;
				},
			},
		});

		// const filteredData = [];
		// let prevValue = null;
		// for (const point of chartDatas) {
		// 	if (point.value !== 0 || prevValue !== 0) {
		// 		filteredData.push(point);
		// 	}
		// 	prevValue = point.value;
		// }

		histogramSeries.setData(chartDatas);

		// if (filteredData?.length < FEW_COLUMN_QLT) {
		// chart.timeScale().applyOptions({
		// 	barSpacing: 10,
		// 	minBarSpacing: 10,
		// });
		// } else {
		chart.timeScale().fitContent();
		// }

		window.addEventListener('resize', handleResize);

		// Clean up the chart when the component is unmounted
		return () => {
			window.removeEventListener('resize', handleResize);

			chart.remove();
		};
	}, [chartDatas, width]);

	return <div ref={chartContainerRef} className="TVChartContainer" />;
};

export default withTranslation()(BotDailyPNLChart);
