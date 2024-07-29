import React from 'react';
import { Row, Col, Card, Image } from 'antd';

const GallerySection = () => {
	const images = [
		'./images/about/image1.jpg',
		'./images/about/image2.jpg',
		'./images/about/image3.jpg',
		'./images/about/image4.jpg',
		'./images/about/image5.jpg',
		'./images/about/image6.jpg',
		'./images/about/image7.jpg',
	];

	return (
		<Card
			className="about-card"
			hoverable
			cover={
				<Image
					width="100%"
					height="370px"
					mb="20px"
					src={images[0]} // Large image
					alt="Large Image"
					// preview={false}
					style={{
						objectFit: 'cover',
						borderRadius: '22px',
					}}
				/>
			}
			style={{ background: 'transparent' }}
		>
			{/* Rows for Small Images */}
			<Row gutter={[20, 20]}>
				{images.slice(1).map((image, index) => (
					<Col
						key={index}
						xs={24} // 1 column on extra small screens
						sm={12} // 2 columns on small screens
						md={8} // 3 columns on medium screens and up
					>
						<Image
							width="100%"
							height="320px"
							src={image}
							alt={`small-image-${index}`}
							// preview={false}
							style={{ objectFit: 'cover', borderRadius: '22px' }}
						/>
					</Col>
				))}
			</Row>
		</Card>
	);
};

export default GallerySection;
