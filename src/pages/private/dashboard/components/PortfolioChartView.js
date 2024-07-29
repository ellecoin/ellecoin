import React from 'react';
import ChartistGraph from 'react-chartist';

const PortfolioChartView = () => (
	<ChartistGraph
		data={{
			labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			series: [[2, 1, 3.5, 7, 3]],
		}}
		options={{
			fullWidth: true,
			showPoint: false,
			chartPadding: {
				right: 40,
			},
			axisX: {
				showLabel: false,
				showGrid: true,
			},
		}}
		type="Line"
	/>
);

export default PortfolioChartView;
