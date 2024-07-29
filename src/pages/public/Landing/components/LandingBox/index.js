import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Space, Image } from 'antd';

const { Title, Paragraph } = Typography;

const LandingBox = () => {
	const { t } = useTranslation();

	return (
		<Space direction="vertical" className="hero" style={{ padding: '80px 0', width: '90%' }}>
			<Title className="hero-title" level={1}>
				{t('Empower Your Financial')}
			</Title>
			<Title className="hero-title-next" level={3}>
				{t('Future With Ellecoin')}
			</Title>
			<Paragraph className="hero-text">
				{t(
					"Don't miss your chance – join us today and experience the first women-centric ecosystem that's changing the game"
				)}
			</Paragraph>
			<Button type="primary" className="hero-btn">
				{t('Try for free')}
			</Button>

			<div className="hero-bg">
				<Image
					preview={false}
					alt="hero"
					src="./images/hero/hero.png"
					style={{
						objectFit: 'cover',
						width: '100%',
						height: 'auto',
						margin: ' 0 auto',
					}}
				/>
			</div>
		</Space>
	);
};

export default LandingBox;
