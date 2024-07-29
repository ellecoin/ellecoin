import React from 'react';
import { Image } from 'antd';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';

const BlogsGallery = () => {
	const { t } = useTranslation();
	const isDesktop = useMediaQuery('(min-width: 992px)');

	return (
		<div className="carousel-container">
			<div className="carousel-inner">
				{/* 1 */}
				<div className="carousel-column">
					<div className="carousel-row">
						<Image src="./images/blogs/blog4.jpg" alt="blog4" className="carousel-image" />
					</div>
					<div className="carousel-box">
						<h3 className="carousel-desk">11,000</h3>
						<p className="carousel-info">{t('Product reviews')}</p>
					</div>
				</div>
				{/* 2 */}
				<div style={{ display: 'flex' }}>
					<div style={{ margin: '0 0 0 20px' }}>
						<Image src="./images/blogs/blog2.jpg" alt="blog2" className="carousel-image-lg" />
					</div>
					<div
						style={{
							margin: '0 20px',
						}}
						className="carousel-column"
					>
						<Image src="./images/blogs/blog3.jpg" alt="blog3" className="carousel-image" />

						<div className="carousel-box">
							<h3 className="carousel-desk">48,000</h3>
							<p className="carousel-info">{t('FEMALES EMPOWERED BY ELLECOIN')}</p>
						</div>
					</div>
				</div>

				{/* 3 */}
				<div style={{ display: 'flex', height: isDesktop ? '420px' : '210px' }}>
					<Image src="./images/blogs/blog5.jpg" alt="blog5" className="carousel-image-md" />
					<div
						style={{
							margin: '0 20px',
						}}
						className="carousel-column"
					>
						<Image src="./images/blogs/blog1.jpg" alt="blog1" />

						<div className="carousel-box">
							<h3 className="carousel-desk">3,800</h3>
							<p className="carousel-info">{t('ELLECOIN Breakpoint 2024 attendees')}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default BlogsGallery;
