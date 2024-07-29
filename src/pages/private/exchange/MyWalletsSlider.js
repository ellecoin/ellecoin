import React, { useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import { uppercaseFirstLetter } from '../../../utils/utils';
import { MARKET_MODE } from '../../../constants/constants';
import { EXPIRATION_EXCHANGE } from '../../../constants/exchange';
import { handleGetExchangeLogo } from '../../../utils/helper';
import Image from '../../../components/Image';
import { useStore } from '../../../context/AppContext';
import CustomPagination from '../../../components/CustomPagination';
import PenIcon from '../../../assets/icons/my-exchange/PenIcon';
import InfoCycleIcon from '../../../assets/icons/my-exchange/InfoCycleIcon';
import DeleteIcon from '../../../assets/icons/my-exchange/DeleteIcon';
import WarningOutlineIcon from '../../../assets/icons/WarningOutlineIcon';
import { ThemeContext } from '../../../context/ThemeContext';

const MyWalletsSlider = ({
	t,
	exchanges = [],
	onEdit,
	onDelete,
	onChangeFilter,
	filter,
	exchangesTotal,
	isDemoAccount,
}) => {
	const { stateStore } = useStore();
	const isMobile = useMediaQuery('(max-width: 768px)');
	const pageSize = useMemo(() => filter?.limit || 0, [filter?.limit]);
	const history = useHistory();
	const { typeTheme } = useContext(ThemeContext);

	const isDisableTrading = (exchange) => {
		const { mode, restrictions } = exchange;
		const { enableSpotAndMarginTrading } = restrictions || {};
		let isDisable = false;
		if (mode === MARKET_MODE.spot && !enableSpotAndMarginTrading) isDisable = true;
		if (isDemoAccount) isDisable = false;
		return isDisable;
	};

	const sortedExchanges = useMemo(
		() =>
			exchanges.sort((ex) =>
				ex.status === EXPIRATION_EXCHANGE.unauthenticated ||
				(ex.status === EXPIRATION_EXCHANGE.authenticated && isDisableTrading(ex))
					? -1
					: 1
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[exchanges]
	);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const currentPage = useMemo(() => Math.ceil(filter?.offset / pageSize) + 1, [filter]);

	return (
		<div className="sywalletsslider-coustom">
			<div className="flex lg:grid lg:grid-cols-3 xl:grid-cols-4 overflow-x-scroll gap-6 hide-scrollbar p-1">
				{(!isMobile ? sortedExchanges.slice(0, pageSize) : exchanges).map((exchange) => (
					<div key={exchange.id} className="flex-[0_0_80vw] md:flex-[0_0_45vw]">
						<div className="items relative" data-qa="exchange-item">
							<div
								className={`wallet-card ${
									exchange.status === EXPIRATION_EXCHANGE.unauthenticated ||
									(exchange.status === EXPIRATION_EXCHANGE.authenticated &&
										isDisableTrading(exchange))
										? 'wallet-error'
										: ''
								}`}
							>
								<div className="flex justify-start" disabled={isDemoAccount}>
									<Tooltip title={t('edit')}>
										<button
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												onEdit?.(exchange.id);
											}}
											data-qa="exchange-edit-button"
											disabled={isDemoAccount}
										>
											<PenIcon noEffect={isDemoAccount} />
										</button>
									</Tooltip>
									<Tooltip title={t('info')}>
										<button
											className="ml-4"
											data-qa="exchange-detail-button"
											disabled={isDemoAccount}
											onClick={() => {
												history.push(`/exchanges/${exchange.id}`);
											}}
										>
											<InfoCycleIcon noEffect={isDemoAccount} />
										</button>
									</Tooltip>
									<Tooltip title={t('delete')}>
										<button
											className="ml-4"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												onDelete?.(exchange.id);
											}}
											data-qa="exchange-delete-button"
											disabled={isDemoAccount}
										>
											<DeleteIcon noEffect={isDemoAccount} />
										</button>
									</Tooltip>
								</div>
								<div className="head pt-2">
									<div className="flex items-center justify-between mb-2">
										<div>
											<Tooltip title={exchange.name}>
												<div
													className={`${
														typeTheme === 'dark' ? 'text-[#FFF]' : 'text-[#5D6589]'
													}  text-[16px] limit-line font-semibold one-line`}
												>
													{exchange.name}
												</div>
											</Tooltip>
											<div className="text-gray-400 lg:text-md overflow-hidden whitespace-nowrap text-ellipsis text-[13px]">
												{`${
													exchange?.exchange !== 'bingx'
														? uppercaseFirstLetter(exchange?.exchange)
														: 'BingX'
												} - ${uppercaseFirstLetter(exchange?.mode)} ${
													exchange?.mode === MARKET_MODE.future ? 'USDT-M' : ''
												}`}
											</div>
										</div>
										<Image
											className="w-[40px] mr-2 object-contain"
											src={handleGetExchangeLogo(exchange.exchange)}
											alt={exchange.exchange}
										/>
									</div>
									{!exchange.latest_updated ? (
										<div className="flex items-center">
											<span className="mr-4">
												{stateStore.displayExchangeTotal(
													exchange.total_balance_to_usd,
													exchange.exchange
												)}
											</span>
											<Tooltip title={t('balance_synchronizing_warning')}>
												<ExclamationCircleFilled className="text-[20px]" />
											</Tooltip>
										</div>
									) : (
										<span className="font-semibold text-[28px]">
											{stateStore.getCurrency(exchange.total_balance_to_usd, exchange.exchange)}
										</span>
									)}
								</div>
								{exchange.status === EXPIRATION_EXCHANGE.unauthenticated && (
									<div className="mt-4 flex items-center">
										<WarningOutlineIcon />
										<span className="text-red-01 ml-2 text-[11px]">{t('exchange_expired')}</span>
									</div>
								)}
								{exchange.status === EXPIRATION_EXCHANGE.authenticated &&
									isDisableTrading(exchange) && (
										<div className="mt-4 flex items-center">
											<WarningOutlineIcon />
											<span className="text-red-01 ml-2 text-[11px]">
												{exchange.mode === MARKET_MODE.spot
													? t('spot_exchange_disabled_trading')
													: t('future_exchange_disabled_trading')}
											</span>
										</div>
									)}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className={`flex ${isMobile ? 'justify-center' : 'justify-between'} mt-4 m-auto`}>
				<CustomPagination
					total={exchangesTotal}
					currentPage={currentPage}
					pageSize={pageSize}
					showCounter
					onChange={(page) => {
						onChangeFilter({ ...filter, offset: (page - 1) * pageSize });
					}}
				/>
			</div>
		</div>
	);
};

export default withTranslation()(MyWalletsSlider);
