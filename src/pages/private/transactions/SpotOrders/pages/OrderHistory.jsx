import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Select, Table, Tooltip, DatePicker, Button, Popover, Divider, ConfigProvider } from 'antd';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import fileDownload from 'js-file-download';
import useDidMount from 'beautiful-react-hooks/useDidMount';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import botService from '../../../../../services/BotService';
import CustomPagination from '../../../../../components/CustomPagination';
import { useStore } from '../../../../../context/AppContext';
import timezones from '../../../../../utils/timezones';
import Loading from '../../../../../components/Loading';
import { getLocaleDatePicker, handleGetExchangeLogo } from '../../../../../utils/helper';
import { getTimeFromStamp } from '../../../../../utils/datetime';
import Image from '../../../../../components/Image';
import { ThemeContext } from '../../../../../context/ThemeContext';
import FilterICon from '../../../../../assets/icons/FilterIcon';
import { panelRender } from '../../../../../components/daterange/StyleWrapperRangePicker';
import { MARKET_MODE } from '../../../../../constants/constants';
import DownloadOutlinedIcon from '../../../../../assets/icons/DownloadOutlinedIcon';
import CardItem from '../components/CardItem';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrderHistory = ({ t }) => {
	const { stateStore, authStore, tickerStore } = useStore();
	const [filterVisible, setFilterVisible] = useState(false);
	const [bots, setBots] = useState([]);
	const [filter, setFilter] = useState({
		ordering: '-created',
	});
	const [transactions, setTransactions] = useState([]);
	const [total, setTotal] = useState(0);

	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [coinOptions, setCoinOptions] = useState([]);
	const [exporting, setExporting] = useState(false);
	const { typeTheme } = useContext(ThemeContext);
	const isXl = useMediaQuery('(min-width: 1280px)');
	const isMobile = useMediaQuery('(max-width: 640px)');
	const pageSize = useMemo(() => (isMobile ? 5 : 10), [isMobile]);
	const columns = useMemo(
		() => [
			{
				key: 'coin',
				title: <span className="text-table-header">{t('coin')}</span>,
				dataIndex: 'coin',
				render: (coin) => <span className="text-table-body">{coin}</span>,
				sorter: true,
				sortOrder: filter.ordering === '-coin' ? 'descend' : filter.ordering === 'coin' ? 'ascend' : false,
			},
			{
				key: 'bot',
				title: <span className="text-table-header">{t('bot')}</span>,
				dataIndex: 'bot_name',
				render: (bot_name) => <span className="text-table-body">{bot_name}</span>,
				sorter: true,
				sortOrder: filter.ordering === '-bot' ? 'descend' : filter.ordering === 'bot' ? 'ascend' : false,
			},
			{
				key: 'side',
				title: <span className="text-table-header">{t('side')}</span>,
				dataIndex: 'side',
				render: (side) => (
					<span
						className={`${
							side === 'SELL' ? 'text-[#FA2256]' : 'text-[#30E0A1]'
						} font-semibold text-table-body`}
					>
						{t(side.toLowerCase()).toUpperCase()}
					</span>
				),
				sorter: true,
				sortOrder: filter.ordering === '-side' ? 'descend' : filter.ordering === 'side' ? 'ascend' : false,
			},
			{
				key: 'executed_qty',
				title: <span className="text-table-header">{t('Executed')}</span>,
				dataIndex: 'executed_qty',
				render: (executed_qty) => <span className="text-table-body">{executed_qty}</span>,
				sorter: true,
				sortOrder:
					filter.ordering === '-executed_qty'
						? 'descend'
						: filter.ordering === 'executed_qty'
						? 'ascend'
						: false,
			},
			{
				key: 'price',
				title: <span className="text-table-header">{t('price')}</span>,
				dataIndex: 'price',
				width: 150,
				render: (price) => <span className="text-table-body">{parseFloat(price)}</span>,
				sorter: true,
				sortOrder: filter.ordering === '-price' ? 'descend' : filter.ordering === 'price' ? 'ascend' : false,
			},
			{
				key: 'profit',
				title: <span className="text-table-header">{t('profit')}</span>,
				dataIndex: 'profit',
				render: (profit, { side, est, exchange_code }) => (
					<div className="flex flex-col text-table-body">
						{side === 'SELL' ? (
							<>
								<span
									className={
										parseFloat(profit) > 0
											? 'text-green-02 text-[12px]'
											: parseFloat(profit) < 0
											? 'text-red-01 text-[12px]'
											: ''
									}
								>
									{`${profit > 0 ? '+' : '-'}${Math.abs(profit)}%`}
								</span>
								<span className="font-normal text-primary">
									≈ {stateStore.getCurrency(est || 0, exchange_code)}
								</span>
							</>
						) : (
							<span className="text-start">-</span>
						)}
					</div>
				),
				sorter: true,
				sortOrder: filter.ordering === '-profit' ? 'descend' : filter.ordering === 'profit' ? 'ascend' : false,
			},
			{
				key: 'fee_cost',
				title: <span className="text-table-header">{t('Trading fee')}</span>,
				dataIndex: 'fee_cost',
				width: 150,
				render: (fee, { fee_currency }) => (
					<span className="text-table-body">
						{parseFloat(fee)} {fee_currency}
					</span>
				),
				sorter: true,
				sortOrder:
					filter.ordering === '-fee_cost' ? 'descend' : filter.ordering === 'fee_cost' ? 'ascend' : false,
			},
			{
				key: 'cost',
				title: <span className="text-table-header">{t('total')}</span>,
				dataIndex: 'cost',
				render: (total, { coin }) => (
					<span className="text-table-body">
						{parseFloat(total)} {coin.split('/')[1] || 'USDT'}
					</span>
				),
				sorter: true,
				sortOrder: filter.ordering === '-cost' ? 'descend' : filter.ordering === 'cost' ? 'ascend' : false,
				width: '15%',
			},
			{
				key: 'created',
				title: (
					<Tooltip title={timezones[authStore.user?.timezone] || authStore.user?.timezone}>
						<div className="flex gap-2 items-center text-table-header">
							<span>{t('created')}</span> <InfoCircleOutlined />
						</div>
					</Tooltip>
				),
				dataIndex: 'created',
				render: (created) => getTimeFromStamp(created),
				sorter: true,
				sortOrder:
					filter.ordering === '-created' ? 'descend' : filter.ordering === 'created' ? 'ascend' : false,
				width: '15%',
			},
		],
		[stateStore.language, filter, typeTheme]
	);

	const themeConfig = {
		components: {
			Select: {
				fontSize: 12,
				optionFontSize: 12,
			},
			DatePicker: {
				fontSize: 12,
				optionFontSize: 12,
			},
			Button: {
				fontSize: 12,
				optionFontSize: 12,
			},
		},
	};

	useDidMount(() => {
		stateStore.setHeaderTitle(t('spot_orders'));
	});

	const getQueryData = (page, ordering) => ({
		bot_id: filter.bot_id !== 'all' ? filter.bot_id : undefined,
		side: filter.side !== 'all' ? filter.side : undefined,
		base: filter.base || undefined,
		quote: filter.quote || undefined,
		order_type: filter.order_type || undefined,
		from_date: filter.time_range?.[0]?.startOf('day')?.unix(),
		to_date: filter.time_range?.[1]?.endOf('day')?.unix(),
		limit: pageSize,
		offset: (page - 1) * pageSize,
		ordering,
	});

	const loadOrder = (page, ordering) => {
		const data = getQueryData(page, ordering);
		setLoading(true);
		botService
			.getOrderHistory(data)
			.then(({ count, results }) => {
				setTotal(count);
				setTransactions(results);
			})
			.finally(() => setLoading(false));
	};

	useDidMount(() => {
		botService
			.getBotsSupportFilter({ limit: 500 })
			.then(({ results }) => setBots(results.filter((i) => i.exchange_mode === MARKET_MODE.spot)));
	});

	const handleSearchMobile = () => {
		setFilterVisible(false);
		loadOrder(1, filter.ordering);
	};

	useEffect(() => {
		if (!isMobile || Object.keys(filter).length === 1) {
			setCurrentPage(1);
			loadOrder(1, filter.ordering);
		}
		if (isMobile && Object.keys(filter).length > 1) {
			setCurrentPage(1);
			loadOrder(1, filter.ordering);
		}
	}, [filter]);

	const searchCoin = (keyword) => {
		tickerStore.searchAllTicker(keyword).then((coins) => setCoinOptions(coins));
	};

	const handleExport = () => {
		setExporting(true);
		botService
			.exportTransactions(getQueryData(currentPage, filter.ordering))
			.then((res) => {
				fileDownload(res, `transactions_${Date.now()}.xlsx`);
			})
			.finally(() => setExporting(false));
	};

	const getFilterView = () => (
		<div className="md:flex gap-2 space-y-2 md:space-y-0">
			<Select
				className="w-full xl:w-[200px]"
				placeholder={t('bot')}
				value={filter.bot_id}
				onChange={(value) => setFilter({ ...filter, bot_id: value })}
				data-qa="transaction-bot-select"
				popupClassName="transaction-bot-select md:min-w-[400px] lg:min-w-[400px]"
				showSearch
				notFoundContent={null}
				filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}
				options={[
					{
						value: 'all',
						label: t('all'),
						children: 'all',
					},
					...bots.map((bot) => ({
						value: bot.id,
						children: bot.name,
						label: (
							<Tooltip
								title={bot.name}
								trigger={['hover']}
								open={bot.name?.length < 50 ? false : undefined}
								placement="topLeft"
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
			<Select
				className="w-full xl:w-[120px]"
				placeholder={t('side')}
				value={filter.side}
				onChange={(side) => setFilter({ ...filter, side })}
				data-qa="transaction-side-select"
				popupClassName="transaction-side-select"
			>
				<Option value="all">{t('all')}</Option>
				<Option value="BUY">{t('buy')}</Option>
				<Option value="SELL">{t('sell')}</Option>
			</Select>
			<Select
				className="w-full xl:w-[120px]"
				placeholder={t('Quote')}
				showSearch
				notFoundContent={null}
				allowClear
				value={filter.quote}
				onSearch={(value) => searchCoin(value)}
				options={coinOptions.map(({ base }) => ({
					label: base,
					value: base,
				}))}
				onSelect={(quote) => setFilter({ ...filter, quote })}
				onClear={() => setFilter({ ...filter, quote: undefined })}
				data-qa="transaction-coin-input"
			/>
			<Select
				className="w-full xl:w-[120px]"
				placeholder={t('Base')}
				showSearch
				notFoundContent={null}
				allowClear
				value={filter.base}
				onSearch={(value) => searchCoin(value)}
				options={coinOptions.map(({ base }) => ({
					label: base,
					value: base,
				}))}
				onSelect={(base) => setFilter({ ...filter, base })}
				onClear={() => setFilter({ ...filter, base: undefined })}
				data-qa="transaction-coin-input"
			/>
			<RangePicker
				locale={getLocaleDatePicker(stateStore.language)}
				className="w-full xl:w-[240px]"
				popupClassName="w-screen md:w-fit"
				format="DD-MM-YYYY"
				placeholder={[t('From date'), t('To date')]}
				value={filter.time_range}
				onChange={(time_range) => setFilter({ ...filter, time_range })}
				disabledDate={(date) => date.unix() > Date.now() / 1000}
				panelRender={panelRender}
				getPopupContainer={(trigger) => trigger.parentElement}
			/>
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

	const renderTable = () => (
		<Table
			loading={loading}
			columns={columns}
			dataSource={transactions}
			rowKey="id"
			scroll={isXl ? false : { x: 1000 }}
			showSorterTooltip={false}
			locale={{
				emptyText: t('no_transaction'),
				triggerDesc: t('trigger_desc'),
				triggerAsc: t('trigger_asc'),
				cancelSort: t('cancel_sort'),
			}}
			onChange={(_, __, sorter) => {
				if (sorter) {
					let { ordering } = filter;
					if (ordering.includes(sorter.columnKey)) {
						if (ordering.startsWith('-')) {
							ordering = sorter.columnKey;
						} else {
							ordering = `-${sorter.columnKey}`;
						}
					} else {
						ordering = sorter.columnKey;
					}

					setFilter({
						...filter,
						ordering,
					});
				}
			}}
			pagination={false}
			data-qa="coins-bought-table"
		/>
	);

	const renderCardItem = () => (
		<>
			{loading && (
				<div className="flex items-center justify-center h-full w-full">
					<Loading />
				</div>
			)}
			{!loading && (transactions || []).map((item) => <CardItem dataItem={item} />)}
		</>
	);

	return (
		<ConfigProvider theme={themeConfig}>
			<div className="flex justify-between items-center gap-2">
				<div className="hidden lg:block mb-4">{getFilterView()}</div>
				<div className="mb-4 flex-1 flex md:justify-end justify-start">
					<Button
						className="button-primary flex items-center gap-[10px] font-semibold w-full md:w-auto"
						type="primary"
						loading={exporting}
						onClick={() => handleExport()}
					>
						{t('Export')}
						<DownloadOutlinedIcon />
					</Button>
				</div>
				<div className="xl:hidden mb-4">
					<Popover
						getPopupContainer={(trigger) => trigger.parentElement}
						overlayClassName="pt-4 px-4"
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
							className={`${
								typeTheme === 'light' ? 'bg-[#FFF]' : 'bg-[#1B1D24]'
							} button-primary-outline--default`}
							icon={<FilterICon color={typeTheme === 'dark' ? '#ffffff' : '#8188A9'} />}
						/>
					</Popover>
				</div>
			</div>
			{isMobile ? <Divider className="mb-4 mt-0" /> : null}
			<div className="min-h-[120px] relative">
				{!isMobile ? renderTable() : renderCardItem()}
				<CustomPagination
					className="mt-[26px]"
					total={total}
					currentPage={currentPage}
					pageSize={pageSize}
					onChange={(page) => {
						setCurrentPage(page);
						loadOrder(page, filter.ordering);
					}}
				/>
			</div>
		</ConfigProvider>
	);
};

export default withTranslation()(OrderHistory);
