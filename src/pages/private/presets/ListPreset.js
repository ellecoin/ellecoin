import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tabs, Table, Tooltip, Button, Input, Select, Popover, Divider, Upload, Flex, Tag } from 'antd';
import fileDownload from 'js-file-download';
import { CloseCircleFilled, CloseOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import CustomPagination from '../../../components/CustomPagination';
import tickerService from '../../../services/TickerService';
import { useStore } from '../../../context/AppContext';
import { getExchangeName, handleGetExchangeLogo, renderDateTimeTable } from '../../../utils/helper';
import timezones from '../../../utils/timezones';
import Image from '../../../components/Image';
import { ThemeContext } from '../../../context/ThemeContext';
import FilterICon from '../../../assets/icons/FilterIcon';
import { toastify } from '../../../components/Toastify';
import ImportIcon from '../../../assets/icons/ImportIcon';
import ExportIcon from '../../../assets/icons/ExportIcon';
import { uppercaseFirstLetter } from '../../../utils/utils';
import PenIcon from '../../../assets/icons/my-exchange/PenIcon';
import DeleteIcon from '../../../assets/icons/my-exchange/DeleteIcon';
import CardItem from './components/CardItem';
import { useLayoutContext } from '../../../context/LayoutContext';
import Loading from '../../../components/Loading';
import { siteConfig } from '../../../data/SiteConfig';

const { TabPane } = Tabs;
const { Option } = Select;

const ListPresets = () => {
	const { t } = useTranslation();
	const [exporting, setExporting] = useState(false);
	const [importing, setImporting] = useState(false);
	const { typeTheme } = useContext(ThemeContext);
	const { onChangeModalConfigs } = useLayoutContext();
	const { supportExchanges } = siteConfig;
	const { stateStore, authStore, tickerStore } = useStore();
	const history = useHistory();
	const { search } = useLocation();
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [filter, setFilter] = useState({});
	const [filterVisible, setFilterVisible] = useState(false);
	const [activeKey, setActiveKey] = useState(query.get('type') || 'fixed');
	const [presets, setPresets] = useState([]);
	const [loading, setLoading] = useState(true);
	const [ordering, setOrdering] = useState('-created');
	const [coinOptions, setCoinOptions] = useState([]);
	const isMd = useMediaQuery('(min-width: 768px)');
	const isMobile = useMediaQuery('(max-width: 768px)');
	const pageSize = useMemo(() => (isMobile ? 5 : 10), [isMobile]);
	const today = dayjs(Date.now()).format('DD-MM-YYYY');

	const columns = useMemo(
		() => [
			{
				key: activeKey === 'fixed' ? 'preset_name' : 'title',
				title: <span className="text-table-header">{t('name')}</span>,
				dataIndex: 'name',
				render: (name) => <p className="text-table-body">{name}</p>,
				sorter: true,
				sortOrder:
					ordering === '-preset_name' || ordering === '-title'
						? 'descend'
						: ordering === 'preset_name' || ordering === 'title'
						? 'ascend'
						: false,
			},
			{
				key: 'exchange',
				title: <span className="text-table-header">{t('exchange')}</span>,
				dataIndex: 'exchange_code',
				render: (exchangeCode, { exchangeMode }) => (
					<>
						<span className="text-table-body mr-1">{getExchangeName(exchangeCode)}</span>
						<Tag>{uppercaseFirstLetter(exchangeMode)}</Tag>
					</>
				),
				sorter: true,
				sortOrder: ordering === '-exchange' ? 'descend' : ordering === 'exchange' ? 'ascend' : false,
			},
			{
				key: 'pair',
				title: <span className="text-table-header">{t('pair_with')}</span>,
				dataIndex: 'pair',
				render: (pair) => <p className="text-table-body">{pair}</p>,
				sorter: true,
				sortOrder: ordering === '-pair' ? 'descend' : ordering === 'pair' ? 'ascend' : false,
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
				responsive: ['lg'],
				render: (created) => renderDateTimeTable(created),
				sorter: true,
				sortOrder: ordering === '-created' ? 'descend' : ordering === 'created' ? 'ascend' : false,
			},
			{
				key: 'actions',
				// title: <span className="text-table-header">{t('actions')}</span>,
				width: 120,
				render: (_, { id, type }) => (
					<div className="text-right space-x-2 inline-flex">
						<Tooltip title={t('edit')}>
							<Button
								className="button-icon"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									history.push(`/presets/${type}/${id}`);
								}}
								data-qa="edit-preset-button"
								icon={<PenIcon />}
							/>
						</Tooltip>
						<Tooltip title={t('delete')}>
							<Button
								className="button-icon"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleDeleteFixedPreset(id);
								}}
								data-qa="delete-preset-button"
								icon={<DeleteIcon />}
							/>
						</Tooltip>
					</div>
				),
				sorter: false,
			},
		],
		[presets, stateStore.language, ordering, activeKey, typeTheme]
	);

	const loadPreset = (type, page, ordering) => {
		setLoading(true);
		tickerService
			.getTickerPreset({
				preset_name: filter.name || undefined,
				exchange_code: filter.exchange?.split('-')[0] || undefined,
				exchange_mode: filter.exchange?.split('-')[1] || undefined,
				pair: filter.quote || undefined,
				limit: pageSize,
				offset: (page - 1) * pageSize,
				ordering,
			})
			.then(({ count, results }) => {
				setTotal(count);
				setPresets(
					results.map(({ id, preset_name, exchange, exchange_code, exchange_mode, pair, created }) => ({
						id,
						name: preset_name,
						type,
						exchange,
						pair,
						exchange_code,
						created: parseInt(created),
						exchangeMode: exchange_mode,
					}))
				);
			})
			.finally(() => setLoading(false));
	};
	const handleSearchMobile = () => {
		setFilterVisible(false);
		loadPreset(activeKey, 1, ordering);
	};

	useEffect(() => {
		if (!isMobile || Object.keys(filter).length === 0) {
			setCurrentPage(1);
			loadPreset(activeKey, 1, ordering);
		}
	}, [filter]);

	const handleDeleteFixedPreset = (id) => {
		onChangeModalConfigs({
			open: true,
			title: t('delete_confirm'),
			children: t('delete_preset_confirm'),
			onOk: () => {
				tickerService
					.deleteFixedPreset(id)
					.then(() => {
						setTotal(total - 1);
						loadPreset(activeKey, currentPage, ordering);
						if (presets.length < 2) {
							setCurrentPage(currentPage - 1);
							loadPreset(activeKey, currentPage - 1, ordering);
						}
					})
					.catch((err) => {});
			},
			type: 'error',
		});
	};

	const getFilterView = () => (
		<div className="md:flex md:flex-row gap-2 space-y-2 md:space-y-0">
			<Input
				className="w-full xl:min-w-[300px]"
				placeholder={t('Search preset name')}
				suffix={<SearchOutlined />}
				onBlur={(e) => {
					if (e.target.value !== filter.search) {
						setFilter({ ...filter, name: e.target.value });
					}
				}}
				onPressEnter={(e) => {
					setFilter({ ...filter, name: e.target.value });
				}}
				data-qa="bot-filter-name-input"
			/>
			<Select
				className="w-full xl:min-w-[240px]"
				placeholder={t('exchange')}
				allowClear={{
					clearIcon: <CloseCircleFilled className="text-[red] text-[14px]" />,
				}}
				onChange={(exchange) => setFilter({ ...filter, exchange })}
				onClear={() => setFilter({ ...filter, exchange: undefined })}
				data-qa="exchange-select"
				popupClassName="exchange-select"
				showSearch
				optionFilterProp="label"
			>
				{supportExchanges.map(({ code, name, mode }) => (
					<Option key={`${code}-${mode}`} value={`${code}-${mode}`} label={name}>
						<div className="flex items-center h-full">
							<Image className="w-[20px] mr-2" src={handleGetExchangeLogo(code)} alt={name} />
							<p className="m-0">{name}</p>
						</div>
					</Option>
				))}
			</Select>
			<Select
				className="w-full xl:min-w-[150px]"
				placeholder={t('coin')}
				showSearch
				notFoundContent={null}
				allowClear
				value={filter.quote}
				onSearch={(value) => tickerStore.searchAllTicker(value).then((coins) => setCoinOptions(coins))}
				options={coinOptions.map(({ base }, idx) => ({
					label: base,
					value: `${idx}-${base}`,
				}))}
				onSelect={(quote) => setFilter({ ...filter, quote: quote.split('-')[1] })}
				onClear={() => setFilter({ ...filter, quote: undefined })}
				data-qa="transaction-coin-input"
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

	const getUIView = (type) =>
		!isMobile ? (
			<Table
				loading={loading}
				columns={columns}
				dataSource={presets}
				rowKey="id"
				showSorterTooltip={false}
				scroll={isMd ? false : { x: 768 }}
				locale={{
					emptyText: t('have_no_preset'),
					triggerDesc: t('trigger_desc'),
					triggerAsc: t('trigger_asc'),
					cancelSort: t('cancel_sort'),
				}}
				onChange={(_, __, sorter) => {
					if (sorter) {
						let order = sorter.columnKey;
						if (ordering.includes(sorter.columnKey)) {
							order = ordering.startsWith('-') ? sorter.columnKey : `-${sorter.columnKey}`;
						}

						setOrdering(order);
						setCurrentPage(1);
						loadPreset(activeKey, 1, order);
					}
				}}
				pagination={false}
				data-qa={`${type}-preset-table`}
			/>
		) : (
			<>
				{loading && (
					<div className="flex items-center justify-center h-full w-full">
						<Loading />
					</div>
				)}
				{!loading &&
					(presets || []).map((item) => (
						<CardItem
							handleDeleteFixedPreset={handleDeleteFixedPreset}
							key={item.id}
							data={item}
							typeTheme={typeTheme}
						/>
					))}
			</>
		);

	const getQueryData = (page, ordering) => ({
		type: activeKey || 'fixed',
		exchange_code: filter.exchange || null,
		preset_name: filter.name || null,
		pair: filter.quote || null,
		limit: pageSize,
		offset: (page - 1) * pageSize,
		ordering,
	});

	const uploadChanged = (event) => {
		const formData = new FormData();
		formData.append('file', event.fileList[0].originFileObj);
		setImporting(true);
		tickerService
			.importPreset(formData, activeKey)
			.then((res) => {
				fileDownload(res, `${activeKey}_preset_${today}.xlsx`);
				toastify.success(t('Success'));
			})
			.catch((err) => {
				toastify.error(t(err.error));
			})
			.finally(() => setImporting(false));
	};

	const handleExport = () => {
		setExporting(true);
		tickerService
			.exportPreset(getQueryData(currentPage, filter.ordering), activeKey)
			.then((res) => {
				fileDownload(res, `${activeKey}_preset_${today}.xlsx`);
			})
			.catch((err) => {
				toastify.error(t(err.error));
			})
			.finally(() => setExporting(false));
	};

	const renderFileController = () => (
		<div className="flex flex-row justify-start text-right mb-4 gap-4">
			<Upload
				className="flex flex-1"
				name={`${activeKey}_ticker_preset_${today}`}
				showUploadList={false}
				accept=".xls, .xlsx, .csv"
				beforeUpload={() => false}
				onChange={(e) => uploadChanged(e)}
				maxCount={1}
			>
				<Button className="button-primary flex items-center gap-[10px] w-full" loading={importing}>
					{t('Import')}
					<ImportIcon width={16} height={16} />
				</Button>
			</Upload>

			<Button
				className={`${isMobile ? 'p-0' : 'p-4'} flex flex-1 button-primary items-center gap-[10px]`}
				type="primary"
				loading={exporting}
				onClick={() => handleExport()}
			>
				{t('Export')}
				<ExportIcon width={16} height={16} />
			</Button>
		</div>
	);

	return (
		<div className="px-4 md:px-8">
			<div className="card-primary">
				<Flex vertical={isMobile} justify="space-between" gap={8} lign="center">
					<div className="hidden lg:block mb-4">{getFilterView()}</div>
					<div className="flex flex-row gap-2">
						{!isMobile && renderFileController()}
						<Button
							onClick={async () => {
								history.replace(`/presets/create?type=${activeKey}`);
							}}
							className="button-primary flex items-center w-full md:w-auto"
							type="primary"
							icon={<PlusOutlined />}
						>
							{t('add_new_preset')}
						</Button>
					</div>
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
								<div className="flex justify-between items-center">
									<div className="flex-1 flex flex-wrap items-center">
										<div className="mr-2 text-secondary">{t('filter_by')}:</div>
										{filter.name && filter.name !== '' && (
											<div className="card-secondary px-2 py-1 rounded-full mr-2 my-1">
												<span className="opacity-60 text-sm">{t('preset_name')}</span>:{' '}
												<span className="text-[12px]">{filter.name}</span>
											</div>
										)}
										{filter.exchange && filter.exchange !== 'all' && (
											<div className="card-secondary px-2 py-1 rounded-full mr-2 my-1">
												<span className="opacity-60 text-sm">{t('exchange')}</span>:{' '}
												<span className="text-[12px]">
													{getExchangeName(filter.exchange?.split('-')?.[0])}
												</span>
											</div>
										)}
										{filter.quote && filter.quote !== 'all' && (
											<div className="card-secondary px-2 py-1 rounded-full mr-2 my-1">
												<span className="opacity-60 text-sm">{t('coin')}</span>:{' '}
												<span className="text-[12px]">{filter.quote.toUpperCase()}</span>
											</div>
										)}
										{(!filter.exchange || filter.exchange === '') &&
											(!filter.quote || filter.quote === 'all') &&
											(!filter.name || filter.name === '') && (
												<div className="card-secondary px-4 py-2 rounded-full">
													<span className="text-[12px]">{t('all')}</span>
												</div>
											)}
									</div>
									<Button
										className={`${
											typeTheme === 'dark' ? '#1E1E25' : '#FFFFFF'
										} button-primary-outline--default`}
										icon={<FilterICon color={typeTheme === 'dark' ? '#FFFFFF' : '#8188A9'} />}
									/>
								</div>
							</Popover>
						</div>
					)}
				</Flex>

				<div className="table-responsive space-y-8">
					<Tabs
						activeKey={activeKey}
						onChange={(key) => {
							setActiveKey(key);
							setPresets([]);
							setCurrentPage(1);
							loadPreset(key, 1);
							history.replace(`/presets?type=${key}`);
						}}
					>
						<TabPane tab={t('fixed_preset')} key="fixed">
							<div className="relative">{getUIView(activeKey)}</div>
						</TabPane>
					</Tabs>
					<CustomPagination
						total={total}
						currentPage={currentPage}
						pageSize={pageSize}
						onChange={(page) => {
							setCurrentPage(page);
							loadPreset(activeKey, page, ordering);
						}}
					/>
					{isMobile && renderFileController()}
				</div>
			</div>
		</div>
	);
};

export default withRouter(ListPresets);
