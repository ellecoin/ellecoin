import { useState, useEffect } from 'react';
import { Area } from '@ant-design/plots/lib/components/area';

import botService from '../../../../services/BotService';

const BotPerformanceChart = ({ botId }) => {
	const [data, setDate] = useState([]);

	useEffect(() => {
		botService.getBotProfitHis(botId, 'daily', 30).then(({ results }) => {
			setDate(
				results.map(({ avg_profit, day, month }) => ({
					avg_profit,
					date: `${day}/${month}`,
				}))
			);
		});
	}, []);

	return (
		<Area
			{...{
				data,
				xField: 'date',
				yField: 'avg_profit',
				xAxis: {
					range: [0, 1],
					grid: null,
					label: null,
				},
				yAxis: {
					// range: [0, 1],
					grid: null,
					label: null,
				},
			}}
		/>
	);
};

export default BotPerformanceChart;
