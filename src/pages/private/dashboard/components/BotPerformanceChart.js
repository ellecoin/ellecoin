import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { createChart } from 'lightweight-charts';
import { useStore } from '../../../../context/AppContext';
import { ThemeContext } from '../../../../context/ThemeContext';
import { themeObject } from '../../../../styles/themes/themeVariables';

const BotPerformanceChart = ({ data, labels, inputValue, exchangeCode }) => {
	const { stateStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const chartContainerRef = useRef(null);
	const [width, setWidth] = useState(0);

	const formatDate = (dateString) => {
		if (dateString) {
			const parts = dateString.split('/');
			const year = parts[0] ? parts[0] : '2023';
			const month = parts[1]?.padStart(2, '0') ? parts[1]?.padStart(2, '0') : '01';
			const day = parts[2]?.padStart(2, '0') ? parts[2]?.padStart(2, '0') : '01';

			return `${year}-${month}-${day}`;
		}
		return '2023-06-06';
	};

	const formatChartData = (datas) => datas.map((item) => ({ ...item, time: formatDate(item.date) }));

	const chartDatas = useMemo(() => {
		if (!labels || labels?.length === 0) {
			return [];
		}
		return formatChartData(
			data.map(({ avg_profit, avg_est }, index) => ({
				date: labels[index],
				value: inputValue === 'profit' ? avg_profit : avg_est,
			}))
		);
	}, [data, labels, stateStore.language, typeTheme, inputValue]);

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

		chart.timeScale().fitContent();

		const lineSeries = chart.addBaselineSeries({
			topLineColor: '#11CABE',
			topFillColor1: 'rgba(17, 202, 190, 0.2)',
			topFillColor2: 'rgba(17, 202, 190, 0)',
			bottomLineColor: '#FA2256',
			bottomFillColor1: 'rgba(250, 34, 86, 0)',
			bottomFillColor2: 'rgba(250, 34, 86, 0.2)',
			lineWidth: 2,

			priceFormat: {
				type: 'custom',
				formatter(price) {
					return inputValue === 'profit'
						? `${price.toFixed(2)}%`
						: `${stateStore.getCurrency(price, exchangeCode)}`;
				},
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

	return <div ref={chartContainerRef} className="TVChartContainer" />;
};

export default withTranslation()(BotPerformanceChart);
