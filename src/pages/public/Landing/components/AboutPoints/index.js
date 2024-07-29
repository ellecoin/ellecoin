import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import PointsList from './PointsList';

const { Title } = Typography;

const AboutPoints = () => {
	const { t } = useTranslation();
	const isDesktop = useMediaQuery('(min-width: 992px)');
	const isLargeScreen = useMediaQuery('(min-width: 1280px)');

	return (
		<div
			style={{
				display: 'flex',
				padding: isDesktop ? '150px 20px 20px 20px' : '20px 0',
				width: '100%',
				flexDirection: isLargeScreen ? 'row' : 'column',
			}}
		>
			<Typography
				style={{
					width: '30%',
				}}
			>
				<Title
					className="point-name"
					level={2}
					style={{
						width: '300px',
						maxWidth: '300px',
					}}
				>
					{t('How ElleCoin Works')}
				</Title>
			</Typography>
			<div
				style={{
					padding: '20px',
					width: isLargeScreen ? '70%' : '100%',
				}}
			>
				<PointsList />
			</div>
		</div>
	);
};

export default AboutPoints;
