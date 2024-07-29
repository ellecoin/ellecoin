import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { createChart } from 'lightweight-charts';
import { useStore } from '../../../../context/AppContext';
import { ThemeContext } from '../../../../context/ThemeContext';
import { themeObject } from '../../../../styles/themes/themeVariables';

const BotPerformanceChart = ({ t, data, labels, period, height = 500 }) => {
	const { stateStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const chartContainerRef = useRef();
	const chartSeriesRef = useRef(null);

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
	const formatChartData = (datas) => {
		const newDatas = datas.map((item) => ({
			...item,
			time: formatDate(item.date),
		}));
		return newDatas;
	};

	const chartDatas = useMemo(() => {
		if (!labels || labels?.length === 0) {
			return [];
		}
		return formatChartData(
			data.map(({ avg_profit, avg_est }, index) => ({
				date: labels[index],
				value: avg_profit,
			}))
		);
	}, [data, labels, stateStore.language, typeTheme]);
	useEffect(() => {
		const chartOptions = {
			layout: {
				textColor: typeTheme === 'dark' ? 'white' : 'black',
				background: { type: 'solid', color: 'transparent' },
			},
			width: chartContainerRef.current?.clientWidth,
			height,
			grid: {
				vertLines: {
					color: 'transparent',
				},
				horzLines: {
					color: 'transparent',
				},
			},
			timeScale: {
				visible: false, // Hide X axis labels
			},
			rightPriceScale: {
				visible: false, // Hide Y axis
			},
			handleScale: false,
			handleScroll: false,
			crosshair: {
				vertLine: {
					color: '#6A5ACD',
					width: 0.5,
					style: 1,
					visible: false,
					labelVisible: false,
				},
				horzLine: {
					color: '#6A5ACD',
					width: 0.5,
					style: 0,
					visible: false,
					labelVisible: false,
				},
				marker: {
					color: '#6A5ACD',
					width: 0.5,
					style: 0,
					visible: false,
					labelVisible: false,
				},
				mode: 0,
			},
		};
		const chart = createChart(chartContainerRef?.current, chartOptions);
		const handleResize = () => {
			chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
		};

		chart.timeScale().fitContent();

		const lineSeries = chart.addBaselineSeries({
			// baseValue: { type: 'percent', price: 0 },
			topLineColor: '#30E0A1',
			topFillColor1: 'rgba(17, 202, 190, 0.2)',
			topFillColor2: 'rgba(17, 202, 190, 0)',
			bottomLineColor: '#FA2256',
			bottomFillColor1: 'rgba(250, 34, 86, 0)',
			bottomFillColor2: 'rgba(250, 34, 86, 0.2)',
			lineWidth: 2,
			priceLineVisible: false,
			priceFormat: {
				type: 'custom',
				formatter(price) {
					return `${price.toFixed(2)}%`;
				},
			},
		});
		chartSeriesRef.current = lineSeries;
		const toolTipWidth = 80;
		const toolTipHeight = 80;
		const toolTipMargin = 15;

		// Create and style the tooltip html element
		const toolTip = document.createElement('div');
		toolTip.style = `width: 96px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
		toolTip.style.background = themeObject[typeTheme].colorBgDropdown;

		toolTip.style.borderColor = themeObject[typeTheme].borderColor;
		chartContainerRef?.current?.appendChild(toolTip);

		// update tooltip
		chart.subscribeCrosshairMove((param) => {
			if (
				param.point === undefined ||
				!param.time ||
				param.point.x < 0 ||
				param.point.x > chartContainerRef?.current?.clientWidth ||
				param.point.y < 0 ||
				param.point.y > chartContainerRef?.current?.clientHeight
			) {
				toolTip.style.display = 'none';
			} else {
				// time will be in the same format that we supplied to setData.
				// thus it will be YYYY-MM-DD
				const dateStr = param.time;
				toolTip.style.display = 'block';
				const data = param.seriesData.get(lineSeries);
				const price = data.value !== undefined ? data.value : data.close;
				toolTip.innerHTML = `<div style="font-size: 24px; margin: 4px 0px; color: ${
					themeObject[typeTheme].textPrimary
				}">
			${Math.round(100 * price) / 100}%
			</div><div style="color: ${themeObject[typeTheme].textPrimary}">
			${dateStr}
			</div>`;

				const coordinate = lineSeries.priceToCoordinate(price);
				let shiftedCoordinate = param.point.x - 50;
				if (coordinate === null) {
					return;
				}
				shiftedCoordinate = Math.max(
					0,
					Math.min(chartContainerRef?.current?.clientWidth - toolTipWidth, shiftedCoordinate)
				);
				const coordinateY =
					coordinate - toolTipHeight - toolTipMargin > 0
						? coordinate - toolTipHeight - toolTipMargin
						: Math.max(
								0,
								Math.min(
									chartContainerRef?.current?.clientHeight - toolTipHeight - toolTipMargin,
									coordinate + toolTipMargin
								)
						  );
				toolTip.style.left = `${shiftedCoordinate}px`;
				toolTip.style.top = `${coordinateY}px`;
			}
		});
		window.addEventListener('resize', handleResize);

		// Clean up the chart when the component is unmounted
		return () => {
			window.removeEventListener('resize', handleResize);

			chart.remove();
		};
	}, [typeTheme]);
	useEffect(() => {
		const lineSeries = chartSeriesRef.current;
		const filteredData = [];
		let prevValue = null;
		for (const point of chartDatas) {
			if (point.value !== 0 || prevValue !== 0) {
				filteredData.push(point);
			}
			prevValue = point.value;
		}
		lineSeries.setData(filteredData);
		return () => null;
	}, [chartDatas, typeTheme]);
	return <div ref={chartContainerRef} className="TVChartContainer" />;
};

export default withTranslation()(BotPerformanceChart);
