import React from 'react';
import { Typography, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import iconsPricing from '../../../../../assets/icons/pricing/index';
import ProCard from './ProCard';

const { Title, Text } = Typography;

const ProSection = () => {
	const { t } = useTranslation();
	const price = '15';
	const term = '/month';
	const info = [{ text: 'Up to 1 user' }, { text: 'Up to 3 devices.', link: { text: 'Need more?', url: '/' } }];
	const benefits = [
		{ text: 'Premium Courses' },
		{ text: 'Premium Trading Tools' },
		{ text: 'Personalized Trading Strategy' },
		{ text: 'Direct Mentorship' },
		{ text: '24/7 Premium Support' },
	];

	return (
		<div className="pro-section">
			<Typography>
				<div className="pro-box">
					<Title className="pro-title" level={3}>
						{t('Pro')}
					</Title>
					<div>{iconsPricing.pro}</div>
				</div>
			</Typography>

			<Text className="pro-text">{t("Let's elevate your financial success together.")}</Text>

			<Title className="pro-price" level={2}>
				${price}
			</Title>
			<Title className="pro-term" level={4}>
				{term}
			</Title>

			<Button type="primary" className="pro-btn">
				{t('Try for Free')}
			</Button>

			<div>
				<ProCard info={info} benefits={benefits} t={t} />
			</div>
		</div>
	);
};

export default ProSection;
