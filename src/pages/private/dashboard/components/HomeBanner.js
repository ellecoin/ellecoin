import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import { Carousel } from 'antd';

import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import homeBannerImage from '../../../../assets/images/home-banner.png';

const HomeBanner = () => {
	const carouselRef = useRef();
	const handlePrevious = () => {
		carouselRef.current.prev();
	};
	const handleNext = () => {
		carouselRef.current.next();
	};

	const CRYPTO_SLIDER = [{ label: 'intro2', value: homeBannerImage, id: 'novos', href: '' }];

	return (
		<div className="relative">
			<Carousel dots={false} autoplay ref={carouselRef} className="w-full" fade>
				{(CRYPTO_SLIDER || []).map((item) => {
					const Content = item?.content;
					return (
						<div className="flex items-center slider w-full relative " key={item.id}>
							<img src={item.value} alt="img" className="rounded-xl cursor-pointer w-full" />
							{Content && <Content />}
						</div>
					);
				})}
			</Carousel>
			<div className="absolute bottom-4 right-4 inline-flex gap-2 z-3">
				<button
					onClick={handlePrevious}
					className="h-6 w-6 hover:scale-110 text-white disabled:text-gray-400 text-[24px]"
				>
					<LeftCircleOutlined />
				</button>
				<button
					onClick={handleNext}
					className="h-6 w-6 hover:scale-110 text-white disabled:text-gray-400 text-[24px]"
				>
					<RightCircleOutlined />
				</button>
			</div>
		</div>
	);
};

export default observer(HomeBanner);
