import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';

const { Title, Paragraph } = Typography;

const PointsList = () => {
	const { t } = useTranslation();
	const isLargeScreen = useMediaQuery('(min-width: 1280px)');

	const points = [
		{
			title: t('Get Started'),
			description: t('Register and log in to ElleCoin to begin managing your trades seamlessly.'),
			lineColor: '#e6ff00',
		},
		{
			title: t('Link Exchanges'),
			description: t(
				'Connect your preferred exchanges, such as Binance, OKX, and Coinbase, using secure API keys.'
			),
			lineColor: '#d5223d',
		},
		{
			title: t('Practice with Demo'),
			description: t('Refine your trading strategies risk-free with our Demo Mode before going live.'),
			lineColor: '#e1e0e4',
		},
		{
			title: t('Auto Live Trading'),
			description: t(
				'Switch to live trading with our advanced bots that use market volatility and dollar-cost averaging to maximize profits.'
			),
			lineColor: '#02c173',
		},
	];

	const cardStyle = {
		padding: isLargeScreen ? '30px' : '10px',
		backdropFilter: 'blur(20px)',
		background: 'rgba(0, 0, 0, 0.28)',
	};

	const renderCard = (point, index) => (
		<Card hoverable style={cardStyle} className="point-box" key={index}>
			<div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
				<div style={{ width: '2px', height: '33px', backgroundColor: point.lineColor, marginRight: '17px' }} />
				<Title className="point-title" level={4} style={{ margin: 0 }}>
					{point.title}
				</Title>
			</div>
			<Paragraph className="point-text" style={{ margin: 0 }}>
				{point.description}
			</Paragraph>
		</Card>
	);

	return (
		<Row gutter={[20, 20]} justify="space-around">
			{/* Left Column */}
			<Col xs={24} xl={12} style={{ width: isLargeScreen ? '340px' : '100%', maxWidth: '400px' }}>
				<Row gutter={[20, 20]}>
					<Col span={24} style={{ marginTop: isLargeScreen ? '80px' : '0' }}>
						{renderCard(points[0], 0)}
					</Col>
					<Col span={24} style={{ marginTop: isLargeScreen ? '60px' : '0' }}>
						{renderCard(points[1], 1)}
					</Col>
				</Row>
			</Col>

			{/* Right Column */}
			<Col xs={24} xl={12} style={{ width: isLargeScreen ? '340px' : '100%', maxWidth: '400px' }}>
				<Row gutter={[20, 20]}>
					<Col span={24} style={{ position: 'relative', top: isLargeScreen ? '-60px' : '0' }}>
						{renderCard(points[2], 2)}
					</Col>
					<Col span={24} style={{ marginTop: isLargeScreen ? '60px' : '0' }}>
						{renderCard(points[3], 3)}
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default PointsList;
