import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import ContactForm from '../components/ContactForm';

const { Title, Text } = Typography;

const Whitepaper = () => {
	const { t } = useTranslation();
	const isDesktop = useMediaQuery('(min-width: 992px)');

	return (
		<div style={{ background: '#0a2303' }}>
			<div
				style={{
					margin: '0 auto',
					width: '70%',
					padding: isDesktop ? '248px 0' : '80px 0 20px',
				}}
			>
				<div
					style={{
						maxWidth: '1000px',
						width: '100%',
					}}
				>
					<Title className="contact-title" level={2}>
						{t('Let’s talk')}
					</Title>
					<Text className="contact-text">
						{t(
							"Whether you have questions, need support, or want to learn more about our platform, we're here to help. Our dedicated team is ready to assist you every step of the way."
						)}
					</Text>
					<ContactForm />
				</div>
			</div>
		</div>
	);
};

export default Whitepaper;
