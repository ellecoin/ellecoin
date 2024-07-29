import React from 'react';
import { Typography, Row, Col, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';

const { Title } = Typography;

const BrandSection = () => {
	const { t } = useTranslation();
	const isDesktop = useMediaQuery('(min-width: 992px)');

	const brands = ['./images/about/forbes.png', './images/about/tech.png', './images/about/msn.png'];

	return (
		<>
			<Typography>
				<Title className="brand-title" level={3}>
					{t(' As Seen on')}
				</Title>
			</Typography>

			<Row
				gutter={[0, 0]}
				style={{
					display: 'flex',
					justifyContent: isDesktop ? 'space-between' : 'center',
					// alignItems: 'center',
					width: '100%',
					margin: '0 auto',
				}}
			>
				{brands.map((brand, index) => (
					<Col
						key={index}
						xs={24}
						sm={12}
						md={8}
						lg={6}
						style={{ width: '100%', maxWidth: '200px', height: '76px' }}
					>
						<Image
							src={brand}
							alt={`brand-${index}`}
							preview={false}
							width="100%"
							height="100%"
							style={{
								objectFit: 'contain',
								// outline: '1px solid red',
							}}
						/>
					</Col>
				))}
			</Row>
		</>
	);
};

export default BrandSection;
