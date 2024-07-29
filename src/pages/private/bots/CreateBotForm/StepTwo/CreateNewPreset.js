import React, { useEffect, useRef, useContext, useState, useMemo } from 'react';
import { Radio, Input, Form, ConfigProvider, Tag, Flex, Button, Select, Modal, Table } from 'antd';
import { withTranslation } from 'react-i18next';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import TickerFilterView from '../../../presets/components/TickerFilterView';
import CustomFormRadioGroup from '../../../../../components/radio/CustomFormRadioGroup';
import { TICKER_FILTER_TYPE, isNull } from '../../helper';
import tickerService from '../../../../../services/TickerService';
import Image from '../../../../../components/Image';
import CoinIcon from '../../../../../components/CoinIcon';
import { themeObject } from '../../../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { toastify } from '../../../../../components/Toastify';
import CustomPagination from '../../../../../components/CustomPagination';
import { getExchangeName, renderDateTimeTable, handleGetExchangeLogo } from '../../../../../utils/helper';
import { uppercaseFirstLetter } from '../../../../../utils/utils';

const CreateNewPreset = ({ formWrapper, t, isUpdateMode = false, disableValidate = false, exchanges }) => {
	const [openLoadPresetModal, setOpenLoadPresetModal] = useState(false);
	const [openSavePresetModal, setOpenSavePresetModal] = useState(false);
	const [isCreatingTicker, setIsCreatingTicker] = useState(false);
	const form = Form.useFormInstance();
	const filterType = Form.useWatch([formWrapper, 'filter_type']);
	const selectedExchangeId = Form.useWatch([formWrapper, 'exchange']);
	const pairWith = Form.useWatch([formWrapper, 'pair_with']);
	const tickerName = Form.useWatch([formWrapper, 'name']);
	const tickerList = Form.useWatch([formWrapper, 'tickers']);
	const prevExchange = useRef(selectedExchangeId);
	const { typeTheme } = useContext(ThemeContext);
	const [presetList, setPresetList] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [ordering] = useState('-created');
	const [filter, setFilter] = useState({});
	const [pageSize] = useState(5);
	const [selectRecord, setSelectRecord] = useState({});
	const [isFetchingData, setIsFetchingData] = useState(false);
	const [validateMsg, setValidateMsg] = useState(null);
	const [rowSelectedId, setRowSelectedId] = useState(null);

	const isMobile = useMediaQuery('(max-width: 768px)');

	const exchangeInfo = useMemo(
		() => (exchanges || []).find((exchange) => exchange.id === selectedExchangeId),
		[selectedExchangeId, exchanges]
	);

	useEffect(() => {
		const values = form.getFieldsValue();
		let pair = pairWith;
		if (
			!exchanges
				.find(({ id }) => id === selectedExchangeId)
				?.trading_pairs.find(({ quote }) => quote === pairWith)
		) {
			pair = exchanges.find(({ id }) => id === selectedExchangeId)?.trading_pairs[0].quote;
		}
		const updateInfo = {
			[formWrapper]: { ...values[formWrapper] },
		};
		if (prevExchange.current) {
			updateInfo[formWrapper].tickers = [];
			updateInfo[formWrapper].pair_with = pair;
		}
		form.setFieldsValue({ ...values, ...updateInfo });
		prevExchange.current = selectedExchangeId;
	}, [selectedExchangeId]);

	const themeConfig = {
		components: {
			Input: {
				controlHeight: 60,
				fontSize: 16,
			},
			Select: {
				controlHeight: 60,
				fontSize: 16,
				controlHeightSM: 40,
				colorSplit: themeObject[typeTheme].inputBg,
			},
		},
	};

	const handleOpenSaveModal = () => {
		form.validateFields([[formWrapper, 'tickers']])
			.then(() => {
				setOpenSavePresetModal(true);
			})
			.catch((error) => {
				// toastify.error('Tickers must be defined for fixed ticker preset');
			});
	};

	const onCreateNewTicker = () =>
		tickerService
			.createTickerPreset(tickerName, tickerList.join(', '), selectedExchangeId, pairWith)
			.then((res) => {
				toastify.success(t('Created successfully'));
			})
			.catch((err) => {
				setValidateMsg(err.errors.message);
			})
			.finally(() => {
				setIsCreatingTicker(false);
				setOpenSavePresetModal(false);
			});

	const handleSaveTicker = () => {
		setIsCreatingTicker(true);
		tickerService
			.validatePresetName(tickerName, filterType)
			.then(() => {
				onCreateNewTicker();
			})
			.catch((err) => {
				const errMsg = Object.values(err.errors)[0].toString();
				setValidateMsg(errMsg);
				setIsCreatingTicker(false);
			});
	};

	const fetchTickerPreset = (type, page, ordering) => {
		setIsFetchingData(true);
		if (type === TICKER_FILTER_TYPE.FIXED) {
			tickerService
				.getTickerPreset({
					preset_name: filter.name || undefined,
					exchange_code: exchangeInfo.exchange || undefined,
					exchange_mode: exchangeInfo.mode || undefined,
					pair: pairWith || undefined,
					limit: pageSize,
					offset: (page - 1) * pageSize,
					ordering,
				})
				.then(({ count, results }) => {
					setTotal(count);
					setPresetList(
						results.map(
							({ tickers, id, preset_name, exchange, exchange_code, exchange_mode, pair, created }) => ({
								id,
								name: preset_name,
								type,
								exchange,
								pair,
								exchange_code,
								created: parseInt(created),
								exchangeMode: exchange_mode,
								tickers,
							})
						)
					);
				})
				.finally(() => setIsFetchingData(false));
		}
	};

	useEffect(() => {
		fetchTickerPreset(filterType, 1, ordering);
	}, [filter, ordering]);

	const handleOpenLoadPresetModal = () => {
		fetchTickerPreset(filterType, 1, ordering);
		setOpenLoadPresetModal(true);
	};

	const columns = useMemo(
		() => [
			{
				key: filterType === 'fixed' ? 'preset_name' : 'title',
				title: <span className="text-table-header">{t('name')}</span>,
				dataIndex: 'name',
				render: (name) => <p className="text-table-body">{name}</p>,
			},
			{
				key: 'exchange',
				title: <span className="text-table-header">{t('exchange')}</span>,
				dataIndex: 'exchange_code',
				render: (exchangeCode, { exchangeMode }) => (
					<>
						<span className="text-table-body mr-2">{getExchangeName(exchangeCode)}</span>
						<Tag>{uppercaseFirstLetter(exchangeMode)}</Tag>
					</>
				),
			},
			{
				key: 'pair',
				title: <span className="text-table-header">{t('pair_with')}</span>,
				dataIndex: 'pair',
				render: (pair) => <p className="text-table-body">{pair}</p>,
			},
			{
				key: 'created',
				title: <span className="text-table-header">{t('created')}</span>,
				dataIndex: 'created',
				render: (created) => renderDateTimeTable(created),
			},
		],
		[ordering, typeTheme]
	);

	const handleSelectRecord = () => {
		const values = form.getFieldsValue();
		const filledInfo = {
			[formWrapper]: { ...values[formWrapper] },
		};

		if (filterType === TICKER_FILTER_TYPE.FIXED) {
			filledInfo[formWrapper].tickers = selectRecord.tickers;
		}

		form.setFieldsValue({ ...values, ...filledInfo });
		setOpenLoadPresetModal(false);
	};

	return (
		<div className="mt-4 relative">
			<ConfigProvider theme={themeConfig}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
					<div>
						<p className="text-secondary mb-[8px] text-[16px]">{t('exchange')}</p>
						<div>
							<Form.Item
								name={[formWrapper, 'exchange']}
								rules={[{ required: true, message: t('exchange_require') }]}
							>
								<Select
									className="w-full"
									disabled={!enableSelectExchange || isUpdateMode}
									data-qa="preset-exchange-select"
									showSearch
									filterOption={(input, option) =>
										option.name?.toLowerCase().includes(input.toLowerCase())
									}
									options={exchanges?.map(({ id, name, exchange, mode }) => ({
										value: id,
										mode,
										name,
										label: (
											<div>
												<Image
													className="w-[18px] mr-2"
													src={handleGetExchangeLogo(exchange)}
													alt={exchange}
												/>
												<span>{name}</span>
											</div>
										),
									}))}
								/>
							</Form.Item>
						</div>
					</div>
					<div>
						<p className="text-secondary mb-[8px] text-[16px]">{t('pair_with')}</p>
						<div>
							<Form.Item name={[formWrapper, 'pair_with']}>
								<Select
									className="w-full"
									showSearch
									disabled={!enableSelectExchange || isUpdateMode}
									data-qa="preset-pair-select"
									filterOption={(input, option) =>
										option.value?.toLowerCase().includes(input.toLowerCase())
									}
									options={exchanges
										.find(({ id }) => id === selectedExchangeId)
										?.trading_pairs.map(({ quote }) => ({
											value: quote,
											label: (
												<div className="flex gap-2 items-center">
													<CoinIcon symbol={quote.toLowerCase()} size={18} />
													<span>{quote}</span>
												</div>
											),
										}))}
								/>
							</Form.Item>
						</div>
					</div>
				</div>
				<p className="text-secondary mb-[10px] text-[16px]">{t('select_the_ticker_filter_type')}</p>
				<Flex
					justify="space-between"
					align="center"
					className={`${isMobile ? 'flex-col-reverse items-start' : ''}`}
				>
					<Flex vertical className="typeTicker">
						<Form.Item name={[formWrapper, 'filter_type']}>
							<CustomFormRadioGroup
								onToggle={() => {
									form.validateFields();
								}}
								disabled={isUpdateMode}
							>
								<Radio value="fixed" data-qa="fixed-ticker-radio">
									{t('fixed_ticker')}
								</Radio>
							</CustomFormRadioGroup>
						</Form.Item>
					</Flex>

					<Flex gap="small" className={`${isMobile ? 'mb-4' : ''}`}>
						<Button onClick={() => handleOpenLoadPresetModal()}>{t('Load from Preset')}</Button>
						<Button onClick={() => handleOpenSaveModal()}>{t('Save to Preset')}</Button>
					</Flex>
				</Flex>

				<TickerFilterView
					filterType={filterType}
					formWrapper={formWrapper}
					exchanges={exchanges}
					disableValidate={disableValidate}
				/>
				<Modal
					title={t('Load from Preset')}
					open={openLoadPresetModal}
					onOk={() => setOpenLoadPresetModal(false)}
					onCancel={() => setOpenLoadPresetModal(false)}
					centered
					footer={[
						<Button
							disabled={isNull(rowSelectedId)}
							className={`${isNull(rowSelectedId) ? '' : 'button-primary'} ml-auto`}
							onClick={() => handleSelectRecord()}
						>
							{t('Select')}
						</Button>,
					]}
					width={1000}
				>
					<Flex justify="space-between" align="center" gap={16} className="mb-3">
						<Input
							className="py-[7px] w-fit"
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
							data-qa="preset-filter-name-input"
						/>
						<Link
							to={`/presets?type=${filterType}`}
							className="text-[#2180F8] text-[14px] underline whitespace-nowrap"
						>
							{t('Preset manager')}
						</Link>
					</Flex>

					<Table
						className="presetModalTable"
						loading={isFetchingData}
						columns={columns}
						dataSource={presetList}
						rowKey="id"
						showSorterTooltip={false}
						pagination={false}
						onRow={(record) => ({
							onClick: () => {
								setSelectRecord(record);
								setRowSelectedId(record.id);
							},
						})}
						rowClassName={(record) => (record.id === rowSelectedId ? 'clickedRow' : '')}
						data-qa={`${filterType}-preset-table`}
						scroll={{ x: 460 }}
					/>
					<CustomPagination
						className="mt-3"
						total={total}
						currentPage={currentPage}
						pageSize={5}
						onChange={(page) => {
							setCurrentPage(page);
							fetchTickerPreset(filterType, page, ordering);
						}}
					/>
				</Modal>

				<Modal
					closeIcon={false}
					title={t('Save to Preset')}
					open={openSavePresetModal}
					okText="Save"
					afterClose={() => {
						form.resetFields([[formWrapper, 'name']]);
						setValidateMsg(null);
					}}
					footer={[
						<Button key="back" onClick={() => setOpenSavePresetModal(false)}>
							{t('cancel')}
						</Button>,
						<Button
							className="button-primary inline-flex"
							loading={isCreatingTicker}
							onClick={() => handleSaveTicker()}
						>
							{t('save')}
						</Button>,
					]}
				>
					<Form.Item name={[formWrapper, 'name']} className="mb-0">
						<Input
							placeholder={t('Input preset name')}
							data-qa="preset-name-input"
							className={validateMsg ? 'border-red-01' : ''}
						/>
					</Form.Item>
					{validateMsg ? <span className="text-[14px] text-[#FA2356] ml-1">{validateMsg}</span> : null}
				</Modal>
			</ConfigProvider>
		</div>
	);
};

export default withTranslation()(CreateNewPreset);
