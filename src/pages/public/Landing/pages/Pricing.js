import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import iconsPricing from '../../../../assets/icons/pricing/index';
import ProSection from '../components/ProSection';

const { Title, Text } = Typography;

const Pricing = () => {
	const { t } = useTranslation();
	const isDesktop = useMediaQuery('(min-width: 992px)');

	return (
		<div
			style={{
				display: 'flex',
				width: '70%',
				padding: isDesktop ? '80px 0' : '80px 0 20px',
				margin: '0 auto',
				flexDirection: isDesktop ? 'row' : 'column',
			}}
		>
			<div
				style={{
					width: isDesktop ? '50%' : '100%',
				}}
			>
				<Typography>
					<Title
						className="pricing-title"
						level={2}
						style={{
							width: isDesktop ? '400px' : '200px',
							maxWidth: '400px',
						}}
					>
						{t('Simple Transparent Pricing:')}
					</Title>
					<Text className="pricing-text">{t('No contracts. No surprise fees.')}</Text>
				</Typography>

				<div
					style={{
						marginTop: '50px',
					}}
					className="pricing-icon"
				>
					{iconsPricing.frame}
				</div>
			</div>

			<div
				style={{
					width: isDesktop ? '50%' : '100%',
					display: 'flex',
					justifyContent: isDesktop ? 'flex-end' : 'center',
					marginTop: isDesktop ? '0' : '80px',
				}}
			>
				<ProSection />
			</div>
		</div>
	);
};
export default Pricing;
