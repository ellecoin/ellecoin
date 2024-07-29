import React, { useEffect, useState } from 'react';

import BotPerformanceView from './components/BotPerformanceView';
import TickerPriceWidget from './components/TickerPriceWidget';
import CoinBoughtOverview from './components/CoinBoughtOverview';
import MyPortfolioView from './components/MyPortfolioView';

import botService from '../../../services/BotService';
import exchangeService from '../../../services/ExchangeService';
import HomeBanner from './components/HomeBanner';
import FearAndGreedView from './components/FearAndGreedView';

const Home = () => {
	const [exchanges, setExchanges] = useState();
	const [bots, setBots] = useState();

	useEffect(() => {
		botService.getBotsSupportFilter({ limit: 500 }).then(({ results }) => setBots(results || []));

		exchangeService.getMyExchangesSupportFilter({ limit: 500 }).then(({ results }) => {
			setExchanges(results);
		});
	}, []);

	return (
		<div className="grid grid-cols-4 gap-5 px-4 md:px-8">
			<div className="col-span-4 md:col-span-3">
				<div className="hidden md:block">
					<HomeBanner />
				</div>
				{/* <div className="hidden md:block mb-6"> */}
				{/*	<TickerPriceWidget /> */}
				{/* </div> */}
				<div className="card-primary mt-6">
					<BotPerformanceView className="h-full min-h-[300px]" bots={bots} period="daily" />
				</div>
				{/* FearAndGreedView: display in mobile device */}
				<div className="card-primary mt-[20px] lg:hidden block">
					<FearAndGreedView />
				</div>
				<div className="card-primary mt-[20px]">
					<CoinBoughtOverview bots={bots || []} />
				</div>
			</div>
			<div className="order-first col-span-4 lg:col-span-1 md:order-last">
				<MyPortfolioView exchanges={exchanges} />
			</div>
		</div>
	);
};

export default Home;
