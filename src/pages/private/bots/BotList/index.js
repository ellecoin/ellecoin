import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, Select, Input, Table, Tooltip, Popover, Divider, Tag, Dropdown, Form, Checkbox, Flex } from 'antd';
import { CloseOutlined, InfoCircleOutlined, MoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';
import { Link as LibLink, Modal, Text } from '../../../../components';
import { PATHS } from '../../../../constants/routes';
import botService from '../../../../services/BotService';
import exchangeService from '../../../../services/ExchangeService';
import CustomPagination from '../../../../components/CustomPagination';
import { useStore } from '../../../../context/AppContext';
import Image from '../../../../components/Image';
import { handleGetExchangeLogo, renderDateTimeTable } from '../../../../utils/helper';
import timezones from '../../../../utils/timezones';
import Loading from '../../../../components/Loading';
import FilterICon from '../../../../assets/icons/FilterIcon';
import { ThemeContext } from '../../../../context/ThemeContext';
import DeleteOrStopBotModal from '../../../../components/modal/DeleteOrStopBotModal';
import { uppercaseFirstLetter } from '../../../../utils/utils';
import { MARKET_MODE, MODAL_TYPES } from '../../../../constants/constants';
import SyncDataIcon from '../../../../assets/icons/SyncDataIcon';
import ImportIcon from '../../../../assets/icons/ImportIcon';
import { BOT_ACTIONS, BOT_STATUS_LIST } from '../../../../constants/bot';
import { useSocketContext } from '../../../../context/SocketContext';
import { ChooseStopBotType, ImportBots, CardItem } from './components';
import { toastify } from '../../../../components/Toastify';
import { BotStatusLabel } from './BotList.styles';
import { matchBotStatusLabel } from '../helper';
import { useLayoutContext } from '../../../../context/LayoutContext';
import { formatError } from '../../../../utils/error';
import { PauseIcon } from '../../../../assets/icons/PauseIcon';
import { StopIcon } from '../../../../assets/icons/StopIcon';
import DeleteIcon from '../../../../assets/icons/my-exchange/DeleteIcon';
import { StartIcon } from '../../../../assets/icons/StartIcon';
import { ViewDetailIcon } from '../../../../assets/icons/ViewDetail';
import { DuplicateIcon } from '../../../../assets/icons/DuplicateIcon';

const { Option } = Select;

const SELECT_ALL_BOT = '_all_';
const ACTION_PLACEHOLDER = '-----------------';
const ACTION_PLACEHOLDER_MOBILE = '-----------------------------';

const STATUS_FILTER = [
	{ label: 'all', value: 'all' },
	{ label: 'on', value: 'on' },
	{ label: 'off', value: 'off' },
	{ label: 'pause', value: 'pause' },
];

const BotList = ({ t }) => {
	const { stateStore, authStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const history = useHistory();
	const [form] = Form.useForm();
	const { onChangeModalConfigs } = useLayoutContext();
	const { reloadBotsSocket } = useSocketContext();
	const [bots, setBots] = useState([]);
	const [exchanges, setExchanges] = useState([]);
	const [filter, setFilter] = useState({ ordering: '-profit' });
	const [clearFilter, setClearFilter] = useState(false);
	const [filterVisible, setFilterVisible] = useState(false);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [botName, setBotName] = useState();
	const [loading, setLoading] = useState(true);
	const [deleteOrStopBot, setDeleteOrStopBot] = useState(false);
	const [actionType, setActionType] = useState();
	const [selectedBotId, setSelectedBotId] = useState();
	const [selectedBotData, setSelectedBotData] = useState({});
	const [reloadBots, setReloadBots] = useState(false);
	const [selectedAction, setSelectedAction] = useState();
	const [selectedBots, setSelectedBots] = useState([]);
	const [bulkLoading, setBulkLoading] = useState(false);
	const [chooseStopBotType, setChooseStopBotType] = useState({
		open: false,
		sellAll: true,
	});
	const isMobile = useMediaQuery('(max-width: 768px)');
	const [exporting, setExporting] = useState(false);
	const [bulkModal, setBulkModal] = useState({
		title: '',
		open: false,
		type: '',
		onOk: undefined,
	});
	const pageSize = useMemo(() => (isMobile ? 5 : 10), [isMobile]);
	const today = dayjs(Date.now()).format('DD-MM-YYYY');
	const isDemoAccount = useMemo(() => authStore?.user?.demo_mode, [authStore?.user?.demo_mode]);

	const isSelectAllBots = useMemo(() => selectedBots.includes(SELECT_ALL_BOT), [selectedBots]);

	const onClickSelectAllBots = () => {
		setSelectedBots(isSelectAllBots ? [] : [SELECT_ALL_BOT]);
	};

	const columns = useMemo(
		() => [
			{
				key: 'name',
				title: <span className="text-table-header">{t('name')}</span>,
				dataIndex: 'name',
				width: 240,
				render: (name, { my_exchange }) => (
					<div>
						<Image
							className="w-[18px] mr-2"
							src={handleGetExchangeLogo(my_exchange?.exchange_code)}
							alt=""
						/>
						<span className="text-primary text-[14px]">{name}</span>
					</div>
				),
				sorter: true,
				sortOrder: filter.ordering === '-name' ? 'descend' : filter.ordering === 'name' ? 'ascend' : false,
				fixed: !isMobile,
			},
			{
				key: 'my_exchange',
				title: <span className="text-table-header">{t('exchange')}</span>,
				dataIndex: 'my_exchange',
				width: 300,
				render: (my_exchange) => (
					<Flex gap={2} justify="space-between" align="center">
						<LibLink to={`${PATHS.exchange}/${my_exchange?.id}`}>{my_exchange?.name}</LibLink>

						{/* <ExchangeButton>{capitalizeFirstLetter(my_exchange?.exchange_mode)}</ExchangeButton> */}
					</Flex>
				),
				sorter: true,
				sortOrder:
					filter.ordering === '-test_mode' ? 'descend' : filter.ordering === 'test_mode' ? 'ascend' : false,
			},
			{
				key: 'profit',
				title: <span className="text-table-header">{t('session_profit')}</span>,
				dataIndex: 'profit',
				width: 160,
				render: (profit, { est, my_exchange }) => (
					<div className="text-table-body text-[12px]">
						<span
							className={`font-semibold ${
								parseFloat(profit) > 0
									? 'text-[#11CABE]'
									: parseFloat(profit) < 0
									? 'text-red-01'
									: 'text-secondary'
							}`}
						>
							{`${profit}%`}
						</span>
						<p>{stateStore.getCurrency(parseFloat(est) || 0, my_exchange?.exchange_code)}</p>
					</div>
				),
				sorter: true,
				sortOrder: filter.ordering === 'profit' ? 'ascend' : filter.ordering === '-profit' ? 'descend' : false,
			},
			{
				key: 'daily_pnl_percent',
				title: <span className="text-table-header">{t('daily_profit')}</span>,
				dataIndex: 'daily_pnl_percent',
				width: 160,
				render: (daily_pnl_percent, { daily_pnl_est, my_exchange }) => (
					<div className="text-table-body text-[12px]">
						<span
							className={`font-semibold ${
								parseFloat(daily_pnl_percent) > 0
									? 'text-[#11CABE]'
									: parseFloat(daily_pnl_percent) < 0
									? 'text-red-01'
									: 'text-secondary'
							}`}
						>
							{`${daily_pnl_percent}%`}
						</span>
						<p>{stateStore.getCurrency(daily_pnl_est, my_exchange?.exchange_code)}</p>
					</div>
				),
				sorter: true,
				sortOrder:
					filter.ordering === '-daily_pnl_percent'
						? 'descend'
						: filter.ordering === 'daily_pnl_percent'
						? 'ascend'
						: false,
			},
			{
				key: 'created',
				title: (
					<Tooltip
						color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'}
						title={timezones[authStore.user?.timezone] || authStore.user?.timezone}
					>
						<div className="flex gap-2 items-center text-table-header">
							<span>{t('created')}</span> <InfoCircleOutlined />
						</div>
					</Tooltip>
				),
				width: 150,
				dataIndex: 'created',
				render: (created) => renderDateTimeTable(created),
				sorter: true,
				sortOrder:
					filter.ordering === '-created' ? 'descend' : filter.ordering === 'created' ? 'ascend' : false,
			},
			{
				key: 'actions',
				title: <span className="text-table-header">{t('actions')}</span>,
				dataIndex: 'actions',
				width: 140,
				render: (_, { id, status, est, profit, est_no_holdings, profit_no_holdings, my_exchange }) => {
					const labelConfigs = matchBotStatusLabel(status);
					let filtedActions = actions
						.filter((action) => !action.forList)
						.map(({ value, label, icon }) => {
							if (status === BOT_STATUS_LIST.on && value === BOT_ACTIONS.start) return;
							if (status === BOT_STATUS_LIST.deleting && value === BOT_ACTIONS.delete) return;
							if (
								BOT_STATUS_LIST.off === status &&
								[BOT_ACTIONS.pause, BOT_ACTIONS.stop].indexOf(value) > -1
							)
								return;
							if (BOT_STATUS_LIST.pause === status && value === BOT_ACTIONS.pause) return;

							const data = {
								id,
								est,
								profit,
								est_no_holdings,
								profit_no_holdings,
								my_exchange,
								status,
							};
							return {
								label: (
									<Flex
										key={value}
										className="gap-2 items-center"
										onClick={() => onClickActionBot(value, data)}
									>
										{icon}
										<Text>{label}</Text>
									</Flex>
								),
								key: value,
							};
						})
						.filter((action) => action);

					filtedActions = filtedActions.flatMap((action, idx) =>
						idx < filtedActions.length - 1
							? [
									action,
									{
										type: 'divider',
										dashed: true,
										style: {
											backgroundColor: `${typeTheme === 'light' ? '#6D5CDA24' : '#31314A'}`,
										},
									},
							  ]
							: [action]
					);
					return (
						<div className="flex items-center space-x-2">
							<BotStatusLabel style={{ backgroundColor: labelConfigs.bgColor }}>
								{t(labelConfigs.label)}
							</BotStatusLabel>

							<Dropdown
								menu={{
									items: filtedActions,
								}}
								overlayStyle={{ minWidth: 164 }}
								trigger={['click']}
							>
								<MoreOutlined />
							</Dropdown>
						</div>
					);
				},
				sorter: false,
			},
		],
		[stateStore.language, bots, typeTheme, selectedBots, total]
	);

	const onClickActionBot = (action, data) => {
		const { id, est, profit, est_no_holdings, profit_no_holdings, my_exchange, status } = data;
		switch (action) {
			case BOT_ACTIONS.detail:
				history.push(`/bots/my-bot/detail/${id}`);
				break;

			case BOT_ACTIONS.delete:
				handleUpdateBotStatus(
					id,
					'delete',
					est,
					profit,
					est_no_holdings,
					profit_no_holdings,
					my_exchange,
					status
				);
				break;
			case BOT_ACTIONS.start:
				handleUpdateBotStatus(id, 'on');
				break;
			case BOT_ACTIONS.stop:
				handleUpdateBotStatus(id, 'off', est, profit, est_no_holdings, profit_no_holdings, my_exchange);
				break;

			case BOT_ACTIONS.pause:
				handleUpdateBotStatus(id, 'pause');
				break;

			case BOT_ACTIONS.duplicate:
				history.push(`/bots/my-bot/duplicate/${id}`);
				break;
			default:
				break;
		}
	};

	const loadBots = (page, ordering) => {
		const data = {
			search: filter.search || undefined,
			exchange: filter.exchange !== 'all' ? filter.exchange : undefined,
			mode: filter.mode !== 'all' ? filter.mode : undefined,
			status: filter.status !== 'all' ? filter.status : undefined,
			limit: pageSize,
			offset: (page - 1) * pageSize,
			ordering: ordering || filter.ordering,
			exchange_mode: MARKET_MODE.spot,
		};
		if (!data.ordering.includes('created')) {
			data.ordering = `${data.ordering},-created`;
		}
		setLoading(true);
		return botService
			.getBots(data)
			.then(({ count, results }) => {
				setTotal(count);
				setBots(results);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleConfirmModal = (botId, status) => {
		setDeleteOrStopBot(false);
		if (status === 'off' || status === 'deleting') {
			setBots(
				bots.map((bot) => {
					if (bot.id === botId) {
						bot.status = status;
					}
					return bot;
				})
			);
		} else if (status === 'delete') {
			setCurrentPage(1);
		}
	};

	useEffect(() => {
		const futureEnableFilterForExchange = { mode: 'spot' };
		exchangeService
			.getMyExchangesSupportFilter({
				limit: 500,
				...futureEnableFilterForExchange,
			})
			.then(({ results }) => {
				setExchanges(results);
			});
	}, []);

	useEffect(() => {
		loadBots(currentPage, filter.ordering).then();
	}, [filter, currentPage, stateStore, reloadBots]);

	useEffect(() => {
		const { bot_id, status } = reloadBotsSocket || {};
		if (bot_id) {
			if (status !== BOT_STATUS_LIST.deleted) {
				setBots(bots.map((bot) => (bot.id === bot_id ? { ...bot, status } : bot)));
			} else {
				reloadBotList();
			}
		}
	}, [reloadBotsSocket]);

	const handleSearchMobile = () => {
		setFilterVisible(false);
		setCurrentPage(1);
	};

	const handleUpdateBotStatus = (
		botId,
		actionType,
		est,
		profit,
		est_no_holdings,
		profit_no_holdings,
		my_exchange,
		status
	) => {
		setActionType(actionType);
		setSelectedBotId(botId);
		setSelectedBotData({
			est,
			profit,
			est_no_holdings,
			profit_no_holdings,
			my_exchange,
			status,
		});
		if (actionType === 'off' || actionType === 'delete') {
			setDeleteOrStopBot(true);
		} else {
			const modalTitle = actionType === BOT_ACTIONS.pause ? 'pause_bot_confirm' : 'start_bot_confirm';
			const actionValue = actionType === BOT_ACTIONS.pause ? BOT_STATUS_LIST.pause : BOT_STATUS_LIST.on;

			setBulkModal({
				type: MODAL_TYPES.warning,
				open: true,
				onOk: () => {
					onCloseBulkModal();
					botService.updateBotStatus(botId, { action: actionValue }).then(() => {
						setBots(
							bots.map((bot) => {
								if (bot.id === botId) {
									bot.status = actionType;
								}
								return bot;
							})
						);
					});
				},
				title: t(modalTitle),
			});
		}
	};

	const getFilterView = () => (
		<div className={`${isMobile ? '' : '[&>*]:max-w-[164px]'} md:flex`}>
			<Input
				className="mb-2 md:mr-2 md:mb-0 xl:min-w-[150px]"
				value={botName}
				placeholder={t('bot_name')}
				prefix={<SearchOutlined />}
				onChange={(e) => setBotName(e.target.value)}
				onBlur={(e) => {
					if (e.target.value !== filter.search) {
						setFilter({ ...filter, search: e.target.value });
					}
				}}
				onPressEnter={(e) => {
					setFilter({ ...filter, search: e.target.value });
				}}
				data-qa="bot-filter-name-input"
			/>
			<Select
				className="w-full md:min-w-[150px] mb-2 md:mr-2 md:mb-0"
				placeholder={t('my_exchange')}
				value={filter.exchange}
				allowClear
				onClear={() =>
					setFilter({
						...filter,
						exchange: undefined,
						exchange_name: undefined,
					})
				}
				notFoundContent={null}
				onChange={(value, item) => {
					setFilter({ ...filter, exchange: value, exchange_name: item?.name });
				}}
				data-qa="bot-filter-exchange-select"
				popupClassName="bot-filter-exchange-select md:min-w-[400px] lg:min-w-[400px]"
				showSearch
				filterOption={(input, option) => option.name?.toLowerCase().includes(input.toLowerCase())}
				options={exchanges?.map(({ id, name, exchange, mode }) => ({
					value: id,
					name,
					label: (
						<div key={id} className="flex items-center w-full">
							<Image
								className="w-[18px] mr-2"
								src={handleGetExchangeLogo(exchange)}
								alt="Exchange Image"
							/>
							<div className="overflow-hidden whitespace-nowrap text-ellipsis inline-block mr-1">
								{name}
							</div>
							<Tag>{uppercaseFirstLetter(mode)}</Tag>
						</div>
					),
				}))}
			/>
			<Select
				className="w-full md:min-w-[150px] mb-2 md:mr-2 md:mb-0"
				placeholder={t('status')}
				value={filter.status}
				onChange={(status) => setFilter({ ...filter, status })}
				data-qa="bot-filter-status-select"
				popupClassName="bot-filter-status-select"
				options={STATUS_FILTER.map(({ label, value }) => ({
					label: t(label).toUpperCase(),
					value,
				}))}
			/>
			<Button
				className="lg:hidden button-primary w-full text-[12px]"
				type="primary"
				onClick={() => {
					handleSearchMobile();
				}}
			>
				{t('apply')}
			</Button>
			{!isMobile && <ReloadButton />}
		</div>
	);

	const reloadBotList = () => {
		setReloadBots(!reloadBots);
	};

	const ReloadButton = () => (
		<Button
			className="min-w-[40px] button-primary-outline--default"
			onClick={reloadBotList}
			disabled={loading}
			icon={<SyncDataIcon className={loading ? 'animate-spin' : ''} />}
		/>
	);

	const actions = [
		{
			...(!isMobile
				? { value: '', label: ACTION_PLACEHOLDER, forList: true }
				: { value: '', label: ACTION_PLACEHOLDER_MOBILE, forList: true }),
		},
		{
			value: BOT_ACTIONS.detail,
			label: t('detail'),
			forDetail: true,
			icon: <ViewDetailIcon />,
		},
		{
			value: BOT_ACTIONS.duplicate,
			label: t('Duplicate'),
			forDetail: true,
			icon: <DuplicateIcon />,
		},
		{
			value: BOT_ACTIONS.start,
			label: t('start_bot'),
			icon: <StartIcon />,
		},
		{ value: BOT_ACTIONS.pause, label: t('pause'), icon: <PauseIcon /> },
		{ value: BOT_ACTIONS.stop, label: t('stop'), icon: <StopIcon /> },
		{ value: BOT_ACTIONS.delete, label: t('delete'), icon: <DeleteIcon /> },
	];

	// bulk bot actions
	const onChangeAction = (value) => {
		setSelectedAction(value);
		if (value) {
			form.setFields([
				{
					name: 'action',
					errors: [],
				},
			]);
		}
	};

	const onChangeSelectedBots = (key) => {
		const updateSelectedBots =
			selectedBots.includes(key) || isSelectAllBots
				? selectedBots.filter((selectedKey) => ![key, SELECT_ALL_BOT].includes(selectedKey))
				: [...selectedBots, key];
		setSelectedBots([...updateSelectedBots]);
	};

	const onApplyBulkBotActions = () => {
		if (!selectedAction) {
			form.setFields([
				{
					name: 'action',
					errors: [t('enter_action')],
				},
			]);
			return;
		}
		if (selectedBots.length < 1) {
			setBulkModal({
				type: MODAL_TYPES.warning,
				open: true,
				title: t('notification'),
				children: t('need_choose_bot_before_bulk'),
			});
			return;
		}
		if (selectedAction === BOT_ACTIONS.delete) {
			setBulkLoading(true);
			botService.checkBulkBotRunning({ bots_id: selectedBots }).then((res) => {
				setBulkLoading(false);
				const allowDelete = res?.allow_delete;
				setBulkModal({
					type: allowDelete ? MODAL_TYPES.error : MODAL_TYPES.warning,
					open: true,
					onOk: allowDelete ? () => onAcceptToBulkAction(BOT_ACTIONS.delete, true) : undefined,
					title: allowDelete ? t('delete_confirm') : t('confirm_stop_bots'),
					children: allowDelete ? t('delete_bots_confirm') : t('need_stop_bots_before_delete'),
				});
			});
			return;
		}

		if (selectedAction === BOT_ACTIONS.stop) {
			setChooseStopBotType({ open: true });
			onCloseBulkModal();
			return;
		}
		onAcceptToBulkAction(selectedAction);
	};

	const onAcceptToBulkAction = (action, is_sell_all_coins) => {
		onCloseBulkModal();
		setBulkLoading(true);
		const isDeleteOrStop = [BOT_ACTIONS.delete, BOT_ACTIONS.stop].indexOf(selectedAction) > -1;
		botService
			.bulkAction({
				bots_id: selectedBots,
				action: action || selectedAction,
				...(isDeleteOrStop ? { is_sell_all_coins } : {}),
			})
			.then((res) => {
				setSelectedBots([]);
				setCurrentPage(1);
				toastify.success(
					t(toastMsg, {
						quantity: isSelectAllBots ? (t('all') || '').toLowerCase() : selectedBots.length,
					})
				);
			})
			.catch((err) => {
				onChangeModalConfigs({
					open: true,
					title: t('error'),
					children: formatError(err)?.message,
				});
			})
			.finally(() => {
				setBulkLoading(false);
			});
	};

	const onCloseBulkModal = () => setBulkModal({ ...bulkModal, open: false });

	const onCloseChooseStopBotType = () => setChooseStopBotType({ ...chooseStopBotType, open: false });

	const onChangeStopBotType = (sellAll) => {
		onCloseChooseStopBotType();
		onAcceptToBulkAction(BOT_ACTIONS.stop, sellAll);
	};

	const toastMsg = useMemo(() => {
		let msg = '';
		switch (selectedAction) {
			case BOT_ACTIONS.start:
				msg = 'started_bot';
				break;
			case BOT_ACTIONS.stop:
				msg = 'stopped_bot';
				break;
			case BOT_ACTIONS.pause:
				msg = 'paused_bot';
				break;
			case BOT_ACTIONS.delete:
				msg = 'deleted_bot';
				break;

			default:
				break;
		}
		return msg + (isSelectAllBots || selectedBots.length > 1 ? 's' : '');
	}, [selectedAction, isSelectAllBots, selectedBots]);

	const renderTable = () => (
		<div className="card-primary rounded-[8px] pt-0">
			<div className="min-h-[120px] mb-4 relative">
				<Table
					loading={loading}
					columns={columns}
					dataSource={bots}
					rowKey="id"
					scroll={{ x: 1200 }}
					showSorterTooltip={false}
					locale={{
						emptyText: t('no_bot'),
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
							// sortOnMobile(ordering);
							setFilter({
								...filter,
								ordering,
							});
						}
					}}
					rowClassName="cursor-pointer [&>.ant-table-cell]:py-2"
					pagination={false}
					data-qa="bots-table"
				/>
			</div>
			<CustomPagination
				total={total}
				currentPage={currentPage}
				pageSize={pageSize}
				onChange={(page) => {
					setCurrentPage(page);
				}}
			/>
		</div>
	);

	const renderCardItem = () => (
		<>
			{!loading ? (
				(bots || []).map((item) => (
					<CardItem
						{...{
							onClickActionBot,
							onChangeSelectedBots,
							selectedBots,
							isSelectAllBots,
						}}
						dataItem={item}
					/>
				))
			) : (
				<div className="flex items-center justify-center h-full w-full">
					<Loading />
				</div>
			)}
			<CustomPagination
				className=""
				total={total}
				currentPage={currentPage}
				pageSize={pageSize}
				onChange={(page) => {
					setCurrentPage(page);
				}}
			/>
		</>
	);
	const handleExportBots = () => {
		if (selectedBots.length < 1) {
			setBulkModal({
				type: MODAL_TYPES.warning,
				open: true,
				title: t('need_choose_bot_before_bulk'),
			});
			return;
		}
		setExporting(true);
		const params = {
			bot_ids: selectedBots.toString(),
		};
		botService
			.getExportList(params)
			.then((res) => {
				fileDownload(res, `${isDemoAccount ? 'DemoAccount' : 'RealAccount'}_BotList_${today}.xlsx`);
			})
			.catch((err) => {
				toastify.error(t(err.error));
			})
			.finally(() => setExporting(false));
	};

	return (
		<div className="px-4 md:px-8">
			<div className="hidden lg:flex mb-4 justify-between">
				{getFilterView()}
				<div className="hidden lg:block md:justify-end justify-start">
					<Link className="w-full md:w-auto" to="/bots/my-bot/create" data-qa="add-new-bot-button">
						<Button
							className="button-primary flex items-center w-full md:w-auto text-[12px]"
							type="primary"
							icon={<PlusOutlined />}
						>
							{t('add_new_bot')}
						</Button>
					</Link>
				</div>
			</div>
			<div className={`${isMobile ? 'flex-col-reverse ' : ''} flex justify-between gap-4`}>
				{/* Action */}
				<div className={`${isMobile ? 'flex-col gap-4' : ''} flex gap-3`}>
					{isMobile && (
						<div className="w-full mb-3">
							<Link className="w-full mt-5" to="/bots/my-bot/create" data-qa="add-new-bot-button">
								<Button
									className="button-primary flex items-center w-full md:w-auto"
									type="primary"
									icon={<PlusOutlined />}
								>
									{t('add_new_bot')}
								</Button>
							</Link>
						</div>
					)}
				</div>
				{/* End Action */}

				{isMobile && (
					<div className="lg:hidden mb-4 w-full lg:w-0">
						<Popover
							getPopupContainer={(trigger) => trigger.parentElement}
							overlayClassName="pt-4 px-4"
							title={
								<div>
									<div className="inline-flex items-center text-primary font-medium text-[16px] space-x-3">
										<button
											className="w-[24px] h-[24px]"
											onClick={() => {
												setFilterVisible(!filterVisible);
												setFilter({ ordering: '-profit' });
												setClearFilter(!clearFilter);
												setCurrentPage(1);
											}}
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
							trigger={['click']}
						>
							<div className="flex justify-between items-center gap-3">
								<div className="flex-1 flex flex-wrap items-center">
									<div className="mr-2 text-secondary text-[14px]">{t('filter_by')}:</div>
									{filter.search && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('bot_name')}</span>:{' '}
											<span className="text-primary">{filter.search}</span>
										</div>
									)}
									{filter.exchange && filter.exchange_name && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('exchange')}</span>:{' '}
											<span className="text-primary">{filter.exchange_name}</span>
										</div>
									)}
									{filter.mode && filter.mode !== 'all' && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('mode')}</span>:{' '}
											<span className="text-primary">
												{filter.mode === '1' ? t('test') : t('real')}
											</span>
										</div>
									)}
									{filter.status && filter.status !== 'all' && (
										<div className="card-secondary px-[12px] py-[4px] mr-2 my-1 text-[12px]">
											<span className="text-secondary">{t('status')}</span>:{' '}
											<span className="text-primary">{filter.status.toUpperCase()}</span>
										</div>
									)}
									{(!filter.exchange || filter.exchange === '') &&
										(!filter.status || filter.status === 'all') &&
										(!filter.search || filter.search === '') &&
										(!filter.mode || filter.mode === 'all') && (
											<div className="card-secondary px-[12px] py-[4px] text-[12px]">
												<span className="text-primary">{t('all')}</span>
											</div>
										)}
								</div>
								<ReloadButton />
								<Button
									className="button-primary-outline--default"
									icon={<FilterICon color={typeTheme === 'dark' ? '#ffffff' : '#8188A9'} />}
									onClick={() => setFilterVisible(!filterVisible)}
								/>
							</div>
						</Popover>
					</div>
				)}
			</div>
			{!isMobile ? renderTable() : renderCardItem()}

			{isMobile && (
				<div className="flex flex-row justify-between gap-4 mt-4">
					<ImportBots {...{ reloadBotList }} classes="flex-1" />
					<Button className="button-primary flex gap-2 flex-1">
						{t('export')}
						<ImportIcon width={16} height={16} />
					</Button>
				</div>
			)}
			<Modal onCancel={onCloseBulkModal} {...bulkModal} />
			<Modal
				hideCancel
				title={t('stop_bots_confirm')}
				open={chooseStopBotType.open}
				onCancel={onCloseChooseStopBotType}
			>
				<ChooseStopBotType
					onClose={onCloseChooseStopBotType}
					onOk={onChangeStopBotType}
					{...{ selectedBots }}
				/>
			</Modal>
			<DeleteOrStopBotModal
				{...{ reloadBotList }}
				data={selectedBotData}
				action={actionType}
				botId={selectedBotId}
				open={deleteOrStopBot}
				setActionType={setActionType}
				onClose={(botId, status) => {
					handleConfirmModal(botId, status);
				}}
			/>
		</div>
	);
};

export default withRouter(withTranslation()(BotList));
