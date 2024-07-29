import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, Menu, Button, Tooltip } from 'antd';
import { withTranslation } from 'react-i18next';

import CoinIcon from '../../../../components/CoinIcon';
import exchangeService from '../../../../services/ExchangeService';
import { useStore } from '../../../../context/AppContext';
import Image from '../../../../components/Image';
import { handleGetExchangeLogo } from '../../../../utils/helper';
import Loading from '../../../../components/Loading';
import { ThemeContext } from '../../../../context/ThemeContext';

const ExchangeOverview = ({ t, className }) => {
	const history = useHistory();
	const { stateStore } = useStore();
	const [exchanges, setExchanges] = useState();
	const [selectedExchange, setSelectedExchange] = useState(null);
	const [balances, setBalances] = useState([]);
	const [fetching, setFetching] = useState(true);
	const { typeTheme } = useContext(ThemeContext);

	useEffect(() => {
		exchangeService.getMyExchanges().then(({ results }) => {
			setExchanges(results);
			setFetching(false);
			setSelectedExchange(results[0]);
		});
	}, []);

	useEffect(() => {
		if (selectedExchange) {
			setFetching(true);
			exchangeService
				.getExchangeTokens(selectedExchange.id, {
					ordering: '-asset_usdt',
					limit: 3,
					offset: 0,
				})
				.then(({ results }) => {
					setBalances(results);
				})
				.finally(() => setFetching(false));
		}
	}, [selectedExchange]);

	const getIcon = (coin) => (
		<Tooltip color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'} title={coin}>
			<span>
				<CoinIcon symbol={coin} size={28} />
			</span>
		</Tooltip>
	);

	return (
		<div className={`${className} flex flex-col card overflow-hidden relative`}>
			{exchanges?.length > 0 && (
				<div className="card-header items-start border-0 pb-0 pt-2" data-qa="exchange-select">
					<Dropdown
						trigger={['click']}
						overlay={
							<div className="max-h-[400px] overflow-y-scroll hide-scrollbar shadow">
								<Menu
									onClick={({ key }) => {
										setBalances([]);
										setSelectedExchange(
											exchanges.find((exchange) => exchange.id === parseInt(key))
										);
									}}
								>
									{exchanges?.map(({ id, name, exchange }) => (
										<Menu.Item key={id}>
											<div>
												<Image
													className="w-[18px] mr-2"
													src={handleGetExchangeLogo(exchange)}
													alt=""
												/>
												<span>{name}</span>
											</div>
										</Menu.Item>
									))}
								</Menu>
							</div>
						}
						overlayClassName="exchange-select-menu"
					>
						<div className="overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer">
							<Image
								className="w-[18px] mr-2"
								src={handleGetExchangeLogo(selectedExchange?.exchange)}
								alt=""
							/>
							<Tooltip
								color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'}
								title={selectedExchange?.name}
								placement="topLeft"
								trigger={['hover']}
							>
								<span className="text-sm">{selectedExchange?.name}</span>
							</Tooltip>
							<span className="text-[1rem] ml-2">
								<i className="fa fa-solid fa-angle-down" />
							</span>
						</div>
					</Dropdown>

					{selectedExchange?.name?.length > 30 && (
						<p className="mb-0 mt-1 text-[10px] opacity-60 md:hidden">{`(${selectedExchange?.name})`}</p>
					)}
				</div>
			)}
			{exchanges?.length === 0 && (
				<div className="flex-1 flex flex-col justify-center items-center">
					<p>{t('no_exchange_yet')}</p>
					<Button type="primary" onClick={() => history.push(`/exchanges`)}>
						{t('add_new_exchange')}
					</Button>
				</div>
			)}

			{fetching && (
				<div className="absolute top-[50%] left-[50%] -translate-x-[50%]">
					<Loading />
				</div>
			)}

			{selectedExchange && !fetching && balances.length === 0 && (
				<div className="flex-1 flex flex-col justify-center items-center py-8">
					<p className="text-sm text-center opacity-60">{t('exchange_has_no_token_yet')}</p>
				</div>
			)}

			{balances?.length > 0 && (
				<div className="px-[2rem] py-4">
					{balances.map(({ symbol, free, asset_usdt }) => (
						<div key={symbol} className="grid grid-cols-5 items-center py-1">
							<div className="col-span-1">{getIcon(symbol)}</div>
							<div className="col-span-4 m-0 ml-2 font-medium">
								{stateStore.getCurrency(parseFloat(asset_usdt), selectedExchange.exchange)}
							</div>
						</div>
					))}
				</div>
			)}

			{exchanges?.length > 0 && (
				<button
					className=" absolute bottom-0 left-0 right-0 py-2 pr-4 text-right hover:underline"
					onClick={() => history.push(`/exchanges/${selectedExchange.id}`)}
					data-qa="view-detail-button"
				>
					{t('view_detail')}
				</button>
			)}
		</div>
	);
};

export default withTranslation()(ExchangeOverview);
