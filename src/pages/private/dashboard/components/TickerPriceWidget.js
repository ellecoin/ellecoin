import React, { useState, useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'antd';

import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import CoinIcon from '../../../../components/CoinIcon';

import tickerService from '../../../../services/TickerService';
import { useStore } from '../../../../context/AppContext';
import Image from '../../../../components/Image';
import { handleGetMarketChangeLogo } from '../../../../utils/helper';
import { ThemeContext } from '../../../../context/ThemeContext';

const TickerPriceWidget = () => {
	const { t } = useTranslation();
	const [coins, setCoins] = useState([]);

	const [scrollPosition, setScrollPosition] = useState(0);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		const scrollInterval = setInterval(() => {
			if (!isHovered) {
				setScrollPosition((prevPosition) => (prevPosition + 1 < coins.length * 2 ? prevPosition + 1 : 0));
			}
		}, 5000);
		return () => clearInterval(scrollInterval);
	}, [coins, isHovered]);

	useEffect(() => {
		tickerService.getTickerPrice().then(({ data }) => {
			const { top_20_coins } = data;
			setCoins(top_20_coins);
		});
	}, []);

	return (
		<>
			<p className="my-4 hidden md:block text-primary font-semibold">{t('Most popular staking crypto')}</p>

			<StyledAutoScroll
				className="auto-scroll-horizontal-container"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<div
					className="auto-scroll-horizontal-content"
					style={{
						transform: `translateX(-${scrollPosition * (100 / (coins.length * 2))}%)`,
						animationPlayState: isHovered ? 'paused' : 'running',
					}}
				>
					{coins.map((coin, index) => (
						<TickerCard coin={coin} key={index} />
					))}

					{coins.map((coin, index) => (
						<TickerCard coin={coin} key={index + coins.length} />
					))}
				</div>
			</StyledAutoScroll>
		</>
	);
};

const TickerCard = ({ coin }) => {
	const { typeTheme } = useContext(ThemeContext);
	const { authStore } = useStore();

	const getIcon = (coin) => (
		<Tooltip color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'} title={coin} trigger={['hover']}>
			<span>
				<CoinIcon symbol={coin} size={42} />
			</span>
		</Tooltip>
	);

	return (
		<div className="auto-scroll-card card mx-2 shadow mb-2 card-ticker-widget">
			<div className="card-body flex  text-black flex-col w-[250px]">
				<div className="flex gap-8 justify-between">
					{getIcon(coin.qc_key)}
					<div className="flex items-center">
						<Image
							className="w-[20px] h-[14px] rounded-none mr-2"
							src={handleGetMarketChangeLogo(coin.price24h >= 0)}
							alt="altImage"
						/>
						<p>{`${(coin.price24h * 100).toFixed(2)}%`}</p>
					</div>
				</div>
				<div className="mt-1">{`${coin.symbol_name} - ${coin.qc_key}`} </div>
				<h2 className="mt-1 text-black mb-0 font-w600 text-[20px]">
					{authStore.getConvertedCurrency(coin.price_usd)}
				</h2>
			</div>
		</div>
	);
};

const StyledAutoScroll = styled('div')`
	overflow: hidden;
	width: 100%;
	display: flex;
	.auto-scroll-horizontal-content {
		display: flex;
		transition: transform 1s ease-in-out;
		animation: scrollAnimation 85s linear infinite;
	}
	.auto-scroll-card {
		flex: 0 0 auto;
	}
	@keyframes scrollAnimation {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
`;

export default observer(TickerPriceWidget);
