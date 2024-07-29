import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import BlogsGallery from '../components/BlogsGallery';

const { Title } = Typography;

const Blog = () => {
	const { t } = useTranslation();
	const isDesktop = useMediaQuery('(min-width: 992px)');

	return (
		<div
			style={{
				width: '100%',
				padding: isDesktop ? '0 0 80px 0' : '40px 0 20px',
				margin: '0 auto',
			}}
		>
			<div
				style={{
					width: '70%',
					margin: '0 auto',
				}}
			>
				<Title className="about-title" level={1}>
					{t('Blogs')}
				</Title>
			</div>
			<BlogsGallery />
		</div>
	);
};
export default Blog;
