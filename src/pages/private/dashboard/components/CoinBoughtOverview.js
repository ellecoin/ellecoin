import React, { useEffect, useState, useMemo, useContext } from 'react';
import { Button, Select, Table, Tooltip, DatePicker, Popover, Divider } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, CloseOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import CoinIcon from '../../../../components/CoinIcon';
import BoughtCoinItemMobile from './BoughtCoinItemMobile';
import CustomPagination from '../../../../components/CustomPagination';
import botService from '../../../../services/BotService';
import { useStore } from '../../../../context/AppContext';
import { getLocaleDatePicker, handleGetExchangeLogo, renderDateTimeTable } from '../../../../utils/helper';
import Image from '../../../../components/Image';
import { ThemeContext } from '../../../../context/ThemeContext';
import FilterICon from '../../../../assets/icons/FilterIcon';
import Loading from '../../../../components/Loading';
import { panelRender } from '../../../../components/daterange/StyleWrapperRangePicker';
import { toastify } from '../../../../components/Toastify';
import DeleteIcon from '../../../../assets/icons/my-exchange/DeleteIcon';
import SyncDataIcon from '../../../../assets/icons/SyncDataIcon';
import { useLayoutContext } from '../../../../context/LayoutContext';

const { RangePicker } = DatePicker;

const CoinBoughtOverview = ({ t, bots }) => {
	const { stateStore, tickerStore, authStore } = useStore();
	const [boughtCoins, setBoughtCoins] = useState([]);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const [limit] = useState(5);
	const [filterVisible, setFilterVisible] = useState(false);
	const [ordering, setOrdering] = useState('-pnl_percent');
	const [sortOrder, setSortOrder] = useState('desc');
	const [coinOptions, setCoinOptions] = useState([]);
	const [filter, setFilter] = useState({});
	const [soldCoins, setSoldCoins] = useState({});
	const [loading, setLoading] = useState(false);
	// const [openTradingModal, setOpenTradingModal] = useState({ isOpen: false, dataFlow: {} });
	const { typeTheme } = useContext(ThemeContext);
	const { onChangeModalConfigs } = useLayoutContext();
	const isMobile = useMediaQuery('(max-width: 768px)');

	const onOpenTradingView = (symbol, exchange_code, exchange_mode) => {
		setOpenTradingModal({
			isOpen: true,
			dataFlow: {
				symbol,
				exchange_code,
				mode: exchange_mode,
			},
		});
	};

	const columns = useMemo(
		() => [
			{
				key: 'symbol',
				title: <span className="text-table-header">{t('symbol')}</span>,
				dataIndex: 'symbol',
				fixed: !isMobile,
				width: 200,
				render: (symbol, { exchange_code, exchange_mode }) => (
					<div
						className="flex cursor-pointer gap-[11px]"
						// onClick={() => onOpenTradingView(symbol, exchange_code, exchange_mode)}
					>
						<div>
							<CoinIcon
								className="flex-[0_0_24px]"
								symbol={symbol.replace('USDT', '').split('/')?.[0]}
								size={24}
								showAlt={false}
							/>
						</div>
						<p className="mb-0 font-w600">{symbol}</p>
					</div>
				),
				sorter: true,
			},
			{
				key: 'bot__name',
				title: <span className="text-table-header">{t('bot')}</span>,
				dataIndex: 'bot_name',
				sorter: true,
			},
			{
				key: 'bought_at',
				title: <span className="text-table-header">{t('bought_at')}</span>,
				dataIndex: 'bought_at',
				render: (text) => parseFloat(text),
				sorter: true,
			},
			{
				key: 'volume',
				title: <span className="text-table-header">{t('volume')}</span>,
				dataIndex: 'volume',
				render: (text) => parseFloat(text),
				sorter: true,
			},
			{
				key: 'stop_loss',
				title: <span className="text-table-header">{`${t('stop_loss')} (%)`}</span>,
				dataIndex: 'stop_loss',
				render: (text) => <span className="text-red-01">{parseFloat(text).toFixed(2)}</span>,
				sorter: true,
			},
			{
				key: 'take_profit',
				title: <span className="text-table-header">{`${t('take_profit')} (%)`}</span>,
				dataIndex: 'take_profit',
				render: (text) => <span className="text-green-01">{parseFloat(text).toFixed(2)}</span>,
				sorter: true,
			},
			{
				key: 'pnl_percent',
				title: <span className="text-table-header">{t('profit')}</span>,
				dataIndex: 'profit',
				render: (_, { pnl, pnl_percent, exchange_code }) => (
					<div>
						<small
							className={`ms-auto ${
								pnl_percent > 0 ? 'text-green-01' : pnl_percent < 0 ? 'text-red-01' : 'opacity-80'
							}`}
						>{`${pnl_percent}%`}</small>
						<p className="ms-auto fs-15 mb-0 font-w600">{stateStore.getCurrency(pnl, exchange_code)}</p>
					</div>
				),
				sorter: true,
			},
			{
				key: 'timestamp',
				title: <span className="text-table-header">{t('order_time')}</span>,
				dataIndex: 'order_time',
				width: 120,
				render: (_, { timestamp }) => renderDateTimeTable(timestamp),
				sorter: true,
			},
			{
				key: 'action',
				width: 130,
				render: (_, { id }) => (
					<div className="inline-flex gap-1">
						<Button
							className="button-primary--danger h-[32px]"
							type="primary"
							disabled={soldCoins[id]}
							onClick={() => handleSellCoin(id)}
							data-qa="bought-coin-sell-button"
							loading={soldCoins[id]}
						>
							<p className="text-[12px] font-semibold leading-5">{t('sell')}</p>
						</Button>
						<Tooltip title={t('delete')}>
							<button className="ml-4" onClick={() => handleDeleteCoin(id)}>
								<DeleteIcon />
							</button>
						</Tooltip>
					</div>
				),
			},
		],
		[stateStore.language, soldCoins, boughtCoins]
	);

	const sortOptions = useMemo(
		() => [
			{
				value: 'symbol',
				label: t('symbol'),
			},
			{
				value: 'bot__name',
				label: t('bot'),
			},
			{
				value: 'bought_at',
				label: t('bought_at'),
			},
			{
				value: 'volume',
				label: t('volume'),
			},
			{
				value: 'stop_loss',
				label: t('stop_loss'),
			},
			{
				value: 'take_profit',
				label: t('take_profit'),
			},
			{
				value: 'pnl_percent',
				label: t('profit'),
			},
			{
				value: 'timestamp',
				label: t('created'),
			},
		],
		[stateStore.language]
	);

	const handleDeleteCoin = (botId) => {
		onChangeModalConfigs({
			title: t('delete_confirm'),
			open: true,
			children: t('delete_confirm_coin_bought'),
			onOk: () => {
				try {
					botService.deleteBoughtCoin(botId);
					toastify.success(t('delete_successfully'));
				} catch (error) {
					toastify.error();
				} finally {
					setTimeout(() => {
						loadCoinBought(page, ordering);
					}, 1000);
				}
			},
		});
	};

	const loadCoinBought = (page, ordering) => {
		const params = {
			bot_id: filter.bot_id !== 'all' ? filter.bot_id : undefined,
			symbol: filter.symbol || undefined,
			from_date: filter.time_range?.[0]?.startOf('day')?.unix(),
			to_date: filter.time_range?.[1]?.endOf('day')?.unix(),
			limit,
			offset: (page - 1) * limit,
			ordering: ordering || undefined,
		};
		setLoading(true);
		botService
			.getBoughtCoin(params)
			.then(({ count, results }) => {
				setBoughtCoins(results.map((item, index) => ({ ...item, key: index })));
				setTotal(count);
				setSoldCoins({});
			})
			.catch(() => {})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleSearchMobile = () => {
		setFilterVisible(false);
		loadCoinBought(page, ordering);
	};

	useEffect(() => {
		loadCoinBought(page, ordering);
	}, [filter, page, ordering]);

	const handleSellCoin = (boughtCoinId) => {
		onChangeModalConfigs({
			title: t('confirmation'),
			open: true,
			children: t('sell_token_confirm'),
			onOk: () => {
				setSoldCoins({ ...soldCoins, [boughtCoinId]: true });
				botService
					.sellBoughtCoin(boughtCoinId)
					.then((res) => {
						if (boughtCoins.length - Object.keys(soldCoins).length > 1) {
							loadCoinBought(page, ordering);
						} else {
							const newPage = Math.max(page - 1, 1);
							loadCoinBought(newPage, ordering);
							setPage(newPage);
						}
						toastify.success(res?.message);
					})
					.catch((err) => {
						toastify.error(err?.error);
					})
					.finally(() => {
						setSoldCoins({});
					});
			},
		});
	};

	const getNewOrder = (sortOrder) => {
		switch (sortOrder) {
			case 'desc':
				return 'asc';
			case 'asc':
				return '';
			default:
				return 'desc';
		}
	};

	const handleSortMobile = (newOrder) => {
		let orderingParams = '';
		switch (newOrder) {
			case 'desc':
				orderingParams = '-pnl_percent';
				break;
			case 'asc':
				orderingParams = 'pnl_percent';
				break;
			default:
				orderingParams = '';
				break;
		}
		setOrdering(orderingParams);
		setPage(1);
		loadCoinBought(1, orderingParams);
	};

	const handleChangeSorter = (value, sortOrder, flag = false) => {
		const ordering = value
			.map((value) => {
				if (sortOrder === 'desc') {
					return `-${value}`;
				}
				return value;
			})
			.join(',');
		setOrdering(ordering);
		setPage(1);
		if (!flag) {
			loadCoinBought(1, ordering);
		}
	};

	const handleOnChangeSelectSort = (value) => {
		handleChangeSorter(value, sortOrder, true);
	};

	const getFilterView = () => (
		<div className={`${isMobile ? 'w-[330px]' : ''} md:flex gap-2 space-y-2 md:space-y-0`}>
			<Select
				className="w-full md:w-0 xl:w-[200px]"
				defaultValue="all"
				onChange={(value) => {
					setPage(1);
					setFilter({ ...filter, bot_id: value });
				}}
				data-qa="bought-coin-bot-select"
				popupClassName="bought-coin-bot-select xl:min-w-[400px]"
				showSearch
				filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}
				options={[
					{ value: 'all', label: t('all_bot'), children: t('all_bot') },
					...bots.map((bot) => ({
						value: bot.id,
						children: bot.name,
						label: (
							<Tooltip
								color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'}
								title={bot.name}
								trigger={['hover']}
								placement="topLeft"
								open={bot.name?.length < 50 ? false : undefined}
							>
								<Image
									className="w-[18px] mr-2"
									src={handleGetExchangeLogo(bot.exchange_code)}
									alt=""
								/>
								{bot.name}
							</Tooltip>
						),
					})),
				]}
			/>

			<RangePicker
				locale={getLocaleDatePicker(stateStore.language)}
				className="w-full xl:w-[250px]"
				popupClassName="w-screen md:w-fit"
				format="DD-MM-YYYY"
				placeholder={[t('From date'), t('To date')]}
				value={filter.time_range}
				onChange={(time_range) => setFilter({ ...filter, time_range })}
				disabledDate={(date) => date.unix() > Date.now() / 1000}
				panelRender={panelRender}
				getPopupContainer={(trigger) => trigger.parentElement}
			/>
			<Select
				className="w-full xl:w-[100px]"
				placeholder={t('coin')}
				showSearch
				notFoundContent={null}
				allowClear
				// value={filter.symbol}
				onSearch={(value) => {
					tickerStore.searchAllTicker(value).then((coins) => setCoinOptions(coins));
				}}
				options={coinOptions.map(({ base }, idx) => ({
					label: base,
					value: `${idx}-${base}`,
				}))}
				onSelect={(symbol) => {
					setFilter({ ...filter, symbol: symbol.split('-')[1] });
					setPage(1);
				}}
				onClear={() => {
					setCoinOptions([]);
					setFilter({ ...filter, symbol: undefined });
				}}
				data-qa="holding-coin-select"
			/>

			<Button
				className={`${
					isMobile ? 'hidden' : ''
				} flex justify-center items-center button-primary-outline--default ml-1`}
				onClick={() => loadCoinBought(1, '-pnl_percent')}
				data-qa="holdingcoin-refresh-button"
				disabled={loading}
				icon={<SyncDataIcon className={` ${loading ? 'animate-spin' : ''}`} />}
			>
				{t('Refresh')}
			</Button>

			{filterVisible && (
				<div className="lg:hidden flex justify-between items-center gap-2">
					<Select
						mode="multiple"
						className="w-full xl:w-[150px]"
						placeholder={t('order_by')}
						allowClear={false}
						data-qa="sort-select"
						popupClassName="sort-select"
						defaultValue={ordering && ordering.replace('-', '')}
						onChange={handleOnChangeSelectSort}
						options={sortOptions}
					/>
				</div>
			)}
			<Button
				className="lg:hidden button-primary w-full"
				type="primary"
				onClick={() => {
					handleSearchMobile();
				}}
			>
				{t('apply')}
			</Button>
		</div>
	);

	return (
		<div className="overflow-hidden">
			<div className="flex justify-between items-center mt-1 mb-5">
				<div className="font-semibold text-primary">
					{t('Holding Coins')} ({total})
				</div>
				<div className="hidden lg:block">{getFilterView()}</div>
				<div className="lg:hidden flex flex-row-reverse gap-2">
					<Button
						className="flex justify-center items-center button-primary-outline--default"
						onClick={() => loadCoinBought(1, '-pnl_percent')}
						data-qa="holdingcoin-refresh-button"
						disabled={loading}
						icon={<SyncDataIcon spin={!!loading} />}
					/>
					<Popover
						getPopupContainer={(trigger) => trigger.parentElement}
						overlayClassName="mx-4 pl-4"
						title={
							<div>
								<div className="inline-flex items-center text-primary font-medium text-[16px] space-x-3">
									<button
										className="w-[24px] h-[24px]"
										onClick={() => setFilterVisible(!filterVisible)}
									>
										<CloseOutlined />
									</button>
									<p>{t('Filter')}</p>
								</div>
								<Divider className="m-0 my-3" />
							</div>
						}
						placement="bottom"
						arrow={false}
						content={getFilterView()}
						open={filterVisible}
						onOpenChange={(v) => setFilterVisible(v)}
						trigger={['click']}
					>
						<Button
							className={`${typeTheme === 'dark' ? 'bg-[#1E1E25]' : 'bg-[#FFFFFF]'} h-[40px] w-[40px]`}
							icon={<FilterICon color={typeTheme === 'dark' ? '#FFFFFF' : '#8188A9'} />}
						/>
					</Popover>
					<Button
						className={`${typeTheme === 'dark' ? 'bg-[#1E1E25]' : 'bg-[#FFFFFF]'} h-[40px] w-[40px]`}
						disabled={loading}
						onClick={() => {
							const newOrder = getNewOrder(sortOrder);
							setSortOrder(newOrder);
							handleSortMobile(newOrder);
						}}
					>
						<div className="flex flex-col items-center">
							<CaretUpOutlined
								className={`text-[8px] ${sortOrder === 'asc' ? 'text-[#58667E]' : 'text-[#B2B3B5]'}`}
							/>
							<CaretDownOutlined
								className={`text-[8px] ${sortOrder === 'desc' ? 'text-[#58667E]' : 'text-[#B2B3B5]'}`}
							/>
						</div>
					</Button>
				</div>
			</div>

			<div className="relative">
				{loading && (
					<div className="flex items-center justify-center h-full w-full absolute z-10">
						<Loading />
					</div>
				)}

				<div className={`${loading ? 'opacity-40' : ''} mt-2 lg:hidden space-y-4`}>
					{boughtCoins.length === 0 && (
						<div className="flex items-center justify-center py-8 opacity-60">
							<span className="text-sm">{t('no_data_yet')}</span>
						</div>
					)}

					{boughtCoins.map((boughtCoin, index) => (
						<BoughtCoinItemMobile
							key={index}
							className={`card-secondary text-[12px] flex flex-col gap-4 ${
								typeTheme === 'dark' ? '' : 'border-[#E4E5EC] border rounded-[8px]'
							}`}
							boughtCoin={boughtCoin}
							disableSell={soldCoins[boughtCoin.id]}
							onSell={() => handleSellCoin(boughtCoin.id)}
							onOpenTradingView={onOpenTradingView}
							loading={soldCoins[boughtCoin.id]}
						/>
					))}
				</div>
				<div className="p-0 hidden lg:block">
					<Table
						className={`${loading ? 'opacity-40' : ''}`}
						columns={columns}
						rowKey="id"
						dataSource={boughtCoins}
						showSorterTooltip={false}
						rowClassName="text-table-body"
						locale={{
							emptyText: t('no_data_yet'),
							triggerDesc: t('trigger_desc'),
							triggerAsc: t('trigger_asc'),
							cancelSort: t('cancel_sort'),
						}}
						onChange={(pagination, filters, sorter) => {
							if (sorter) {
								const ordering =
									sorter.order === 'ascend'
										? sorter.columnKey
										: sorter.order === 'descend'
										? `-${sorter.columnKey}`
										: '-pnl';
								loadCoinBought(1, ordering);
							}
						}}
						pagination={false}
						data-qa="coins-bought-table"
						scroll={{ x: 1000 }}
					/>
				</div>
			</div>

			<CustomPagination
				className="lg:p-[1.5rem] py-[10px]"
				total={total}
				currentPage={page}
				pageSize={limit}
				onChange={(page) => {
					setPage(page);
				}}
				disabled={Object.keys(soldCoins).length > 0}
			/>

			{/* <TradingViewWidgetModal */}
			{/*	open={openTradingModal.isOpen} */}
			{/*	dataFlow={openTradingModal.dataFlow} */}
			{/*	typeTheme={typeTheme} */}
			{/*	language={stateStore.language} */}
			{/*	onClose={() => setOpenTradingModal({ isOpen: false, dataFlow: {} })} */}
			{/*	timezone={authStore.user.timezone} */}
			{/* /> */}
		</div>
	);
};

export default withTranslation()(CoinBoughtOverview);
