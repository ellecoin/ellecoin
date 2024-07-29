import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import GallerySection from '../components/GallerySection';
import AboutPoints from '../components/AboutPoints';
import BrandSection from '../components/BrandSection';

const { Title, Paragraph } = Typography;

const About = () => {
	const { t } = useTranslation();
	const isDesktop = useMediaQuery('(min-width: 992px)');

	return (
		<>
			<div direction="vertical" className="about-gallery-bg">
				<div
					className="about"
					style={{
						width: '70%',
						padding: isDesktop ? '80px 0' : '80px 0 20px',
						margin: '0 auto',
					}}
				>
					<Title className="about-title" level={1}>
						{t('About Us')}
					</Title>
					<Paragraph className="about-text">
						{t(
							'At ElleCoin, we believe in empowering everyone to take control of their financial future. Our platform is designed with a special focus on helping women transition into the world of crypto trading and finance. With a supportive community, comprehensive educational resources, and advanced trading tools, we strive to make crypto accessible and inclusive for all. Join us and become part of a financial revolution that values diversity and empowerment.'
						)}
					</Paragraph>
					<div className="about-box">
						<GallerySection />
					</div>
				</div>
			</div>

			<div className="about-brand-bg">
				<div
					style={{
						width: '70%',
						padding: '80px 0 ',
						margin: '0 auto',
					}}
				>
					<AboutPoints />
					<BrandSection />
				</div>
			</div>
		</>
	);
};

export default About;
