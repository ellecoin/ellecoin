import React, { useEffect, useMemo, useRef, useState, memo, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { DatePicker, Input, Modal, Table } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Pie, measureTextWidth } from '@ant-design/plots';
import dayjs from 'dayjs';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import exchangeService from '../../../services/ExchangeService';
import { useStore } from '../../../context/AppContext';
import Image from '../../../components/Image';
import CustomPagination from '../../../components/CustomPagination';
import CoinIcon from '../../../components/CoinIcon';
import { getLocaleDatePicker, handleGetExchangeLogo, renderStatistic } from '../../../utils/helper';
import BTCIcon from '../../../assets/icons/BTCIcon';
import Loading from '../../../components/Loading';
import DeleteIcon from '../../../assets/icons/exchange-detail/DeleteIcon';
import EditIcon from '../../../assets/icons/exchange-detail/EditIcon';
import ReSyncIcon from '../../../assets/icons/exchange-detail/ReSyncIcon';
import { themeObject } from '../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../context/ThemeContext';
import { panelRender } from '../../../components/daterange/StyleWrapperRangePicker';
import AccountBalanceChart from './AccountBalanceChart';
import NoDataYetIcon from '../../../assets/icons/NoDataYetIcon';
import { uppercaseFirstLetter } from '../../../utils/utils';
import { toastify } from '../../../components/Toastify';

const { RangePicker } = DatePicker;
const PieMemo = memo(({ ...config }) => <Pie {...config} />);

const ExchangeDetail = ({ t }) => {
	const { stateStore } = useStore();
	const { exchangeId } = useParams();
	const history = useHistory();
	const [exchangeInfo, setExchangeInfo] = useState();
	const [tokens, setTokens] = useState([]);
	const [tokenChartData, setTokenChartData] = useState([]);
	const [balanceData, setBalanceData] = useState([]);
	const [filter, setFilter] = useState();
	const [balanceFilter, setBalanceFilter] = useState({
		time_range: [dayjs().subtract(30, 'days'), dayjs()],
	});
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(5);
	const [ordering, setOrdering] = useState('-asset_usdt');
	const [balanceTextSize, setBalanceTextSize] = useState(20);
	const [loading, setLoading] = useState(true);
	const [reSyncingExchange, setReSyncingExchange] = useState(false);
	const [enableEdit, setEnableEdit] = useState(false);
	const [exchangeName, setExchangeName] = useState('');
	const prevExchangeName = useRef();
	const isMobile = useMediaQuery('(max-width: 640px)');
	const is2Xl = useMediaQuery('(min-width: 1536px)');

	const { typeTheme } = useContext(ThemeContext);
	const legendItemPercentMap = useRef({});
	const plotRef = useRef(null);
	const inputRef = useRef(null);

	const [legendItemArray, setLegendItemArray] = useState([]);

	useEffect(() => {
		if (window.innerWidth <= 640) {
			setBalanceTextSize(16);
		} else if (window.innerWidth <= 768) {
			setBalanceTextSize(18);
		}
	}, []);

	const getColorPieChart = (index) => {
		switch (index) {
			case 1:
				return '#5889ee';
			case 2:
				return '#57cf9f';
			case 3:
				return '#5a6c8c';
			case 4:
				return '#ebb518';
			case 5:
				return '#6b5cee';
			case 6:
				return '#69bfe3';
			default:
				return '#363062';
		}
	};

	const prepareData = (exchange, mainTokens) => {
		setExchangeInfo(exchange);
		setExchangeName(exchange.name);
		prevExchangeName.current = exchange.name;
		const selectedTokens = mainTokens
			.filter(({ value }) => value / exchange.total_balance_to_usd > 0.01)
			.slice(0, 5);
		const selectedTotal = selectedTokens.reduce((t, { value }) => t + value, 0);
		if (selectedTotal < exchange.total_balance_to_usd) {
			selectedTokens.push({
				type: t('others').toUpperCase(),
				value: Math.floor((exchange.total_balance_to_usd - selectedTotal) * 100) / 100,
			});
		}
		setTokenChartData(selectedTokens);
		legendItemPercentMap.current = selectedTokens.reduce(
			(result, { type, value }) => ({
				...result,
				[type]: {
					unchecked: false,
					value:
						Math.round(
							(exchange?.total_balance_to_usd ? value / exchange?.total_balance_to_usd : 0) * 10000
						) / 100,
				},
			}),
			{}
		);
		const tmp = Object.keys(legendItemPercentMap.current).map((key) => [
			key,
			legendItemPercentMap.current[key].value,
		]);
		setLegendItemArray(tmp);
	};

	const loadToken = (page, ordering) => {
		const data = {
			limit: pageSize,
			offset: (page - 1) * pageSize,
			ordering,
			search: filter || undefined,
		};
		exchangeService.getExchangeTokens(exchangeId, data).then(({ count, results }) => {
			setTotal(count);
			setTokens(results);
		});
	};

	const loadMainToken = () =>
		exchangeService
			.getExchangeTokens(exchangeId, {
				limit: 8,
				offset: 0,
				ordering: '-asset_usdt',
			})
			.then(({ results }) =>
				results.map(({ symbol, asset_usdt }) => ({
					type: symbol,
					value: parseFloat(asset_usdt) || 0,
				}))
			);

	const loadBalance = () => {
		Promise.all([exchangeService.getExchangeInfo(exchangeId), loadMainToken()])
			.then(([exchange, mainTokens]) => {
				prepareData(exchange, mainTokens);
			})
			.catch(({ status_code }) => {
				if (status_code === 404) {
					history.replace('/404');
				}
			})
			.finally(() => setLoading(false));
	};

	const getPortfolio = () => {
		exchangeService
			.getExchangePortfolio(exchangeId, {
				report_type: 'daily',
				ordering: '-created',
				from_date: balanceFilter.time_range?.[0]?.startOf('day')?.unix(),
				to_date: balanceFilter.time_range?.[1]?.endOf('day')?.unix(),
				limit: 30,
			})
			.then(({ results }) => {
				setBalanceData(
					results.reverse().map(({ avg_asset, day, month, year, timestamp }) => ({
						value: avg_asset,
						type: dayjs.tz(parseInt(timestamp) * 1000 || `${year}-${month}-${day}`).format('YYYY-MM-DD'),
					}))
				);
			});
	};

	const reSyncExchange = async () => {
		const exchangeInfo = await exchangeService.reSyncExchange(exchangeId);
		const mainTokens = await loadMainToken();
		prepareData(exchangeInfo, mainTokens);
	};

	useEffect(() => {
		loadBalance();
		loadToken(currentPage, ordering);
	}, [exchangeId]);

	useEffect(() => {
		getPortfolio();
	}, [balanceFilter]);

	const handleDeleteExchange = (exchangeId) => {
		Modal.confirm({
			title: t('delete_confirm'),
			content: t('delete_confirm_exchange'),
			okText: t('yes'),
			cancelText: t('no'),
			onOk: () => {
				exchangeService.deleteExchange(exchangeId).then(() => {
					history.push('/exchanges');
				});
			},
		});
	};

	const config = useMemo(
		() => ({
			theme: typeTheme,
			appendPadding: 10,
			data: tokenChartData,
			height: 250,
			angleField: 'value',
			colorField: 'type',
			radius: 1,
			pieStyle: {
				lineWidth: 0,
			},
			interactions: [
				{
					type: 'element-active',
				},
			],
			innerRadius: 0.64,
			legend: false,
			label: false,
			statistic: {
				title: {
					offsetY: -4,
					customHtml: (container, view, datum) => {
						const { width, height } = container.getBoundingClientRect();
						const containerWidth = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
						const text = !isMobile ? (datum ? datum.type : t('total')) : '';
						const fontWeight = !isMobile ? 400 : 600;
						const percentColor =
							exchangeInfo?.portfolio_pnl_percent > 0
								? '#11CABE'
								: exchangeInfo?.portfolio_pnl_percent < 0
								? '#FA2256'
								: '';
						let scale = 1;
						const style = {
							fontSize: 16,
							color: themeObject[typeTheme].textPrimary,
						};
						const textWidth = measureTextWidth(text, style);

						if (containerWidth < textWidth) {
							scale = (containerWidth - 20) / textWidth;
						}
						const textStyleStr = `width:100%;`;
						if (exchangeInfo?.portfolio_pnl_percent > 0) {
							return `<div  style="display: flex; font-weight: ${fontWeight}; gap: 8px; align-items: center; padding: 5px 10px;
			justify-content: center;${textStyleStr}; font-size:${scale * style.fontSize}px;color:${style.color};line-height:${
								scale < 1 ? 1 : 'inherit'
							};"><span class="text-primary">${text}</span>   <svg
	\t\t\t\t
	\t\t\t\twidth="9"
	\t\t\t\theight="15"
	\t\t\t\tviewBox="0 0 6 10"
	\t\t\t\tfill="none"
	\t\t\t\txmlns="http://www.w3.org/2000/svg"
	\t\t\t>
	<path
	\t\t\t\t\td="M0.294948 4.92926C0.358068 5.04626 0.47809 5.1192 0.608632 5.1192H2.64136V9.13285C2.64136 9.33552 2.80202 9.5 2.99999 9.5C3.19795 9.5 3.35862 9.33552 3.35862 9.13285V5.1192H5.39134C5.52236 5.1192 5.64239 5.04626 5.70503 4.92926C5.76862 4.81227 5.76432 4.66932 5.69498 4.55624L3.30363 0.671335C3.23764 0.564618 3.12336 0.5 2.99999 0.5C2.87662 0.5 2.76233 0.564618 2.69635 0.671335L0.30499 4.55624C0.268649 4.61596 0.25 4.68401 0.25 4.75205C0.25 4.81276 0.265302 4.87395 0.294948 4.92926Z"
	\t\t\t\t\tfill="#11CABE"
	\t\t\t\t/>
	\t\t\t</svg> <p style="color:${percentColor}">${exchangeInfo?.portfolio_pnl_percent}%</p></div>`;
						}
						if (exchangeInfo?.portfolio_pnl_percent < 0) {
							return `<div  style="display: flex; font-weight: ${fontWeight}; gap: 8px; align-items: center; padding: 5px 10px;
			justify-content: center;${textStyleStr};font-size:${scale * style.fontSize}px;color:${style.color};line-height:${
								scale < 1 ? 1 : 'inherit'
							};"><span class="text-primary">${text}</span><svg
	\t\t\t\t
	\t\t\t\twidth="9"
	\t\t\t\theight="15"
	\t\t\t\tviewBox="0 0 6 10"
	\t\t\t\tfill="none"
	\t\t\t\txmlns="http://www.w3.org/2000/svg"
	\t\t\t>
	<path
	\t\t\t\td="M5.70505 5.07074C5.64193 4.95374 5.52191 4.8808 5.39137 4.8808H3.35864V0.867147C3.35864 0.664482 3.19798 0.5 3.00001 0.5C2.80205 0.5 2.64138 0.664482 2.64138 0.867147V4.8808H0.608657C0.477637 4.8808 0.357615 4.95374 0.294974 5.07074C0.231377 5.18773 0.23568 5.33068 0.305016 5.44376L2.69637 9.32866C2.76236 9.43538 2.87664 9.5 3.00001 9.5C3.12338 9.5 3.23767 9.43538 3.30365 9.32866L5.69501 5.44376C5.73135 5.38404 5.75 5.31599 5.75 5.24795C5.75 5.18724 5.7347 5.12605 5.70505 5.07074Z"
	\t\t\t\tfill="#FA2256"
	\t\t\t/>
	\t\t\t</svg> <p style="color:${percentColor}">${exchangeInfo?.portfolio_pnl_percent}%</p></div>`;
						}
						return `<div  style="display: flex; font-weight: ${fontWeight}; gap: 8px; align-items: end; padding: 5px 10px;
			justify-content: center;${textStyleStr};font-size:${scale * style.fontSize}px;color:${style.color};line-height:${
							scale < 1 ? 1 : 'inherit'
						};">
			<span class="text-primary">${text}</span>
			<span class="text-primary">0%</span>
			</div>`;
					},
				},
				content: !isMobile
					? {
							style: {
								whiteSpace: 'pre-wrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							},
							customHtml: (container, _, datum) => {
								const { width } = container.getBoundingClientRect();
								const text = datum
									? stateStore.getCurrency(datum.value, exchangeInfo?.exchange)
									: stateStore.getCurrency(
											exchangeInfo?.total_balance_to_usd || 0,
											exchangeInfo?.exchange
									  );
								return renderStatistic(width, text, {
									fontSize: balanceTextSize,
									color: themeObject[typeTheme].textFifth,
								});
							},
					  }
					: undefined,
			},
			tooltip: {
				showMarkers: false,
				formatter: (datum) => ({
					name: datum.type,
					value: `${stateStore.getCurrency(datum.value, exchangeInfo?.exchange)} (${
						legendItemPercentMap.current[datum.type].value
					}%)`,
				}),
			},
			onReady: (plot) => {
				plotRef.current = plot;
				plot.chart.removeInteraction('legend-filter');
			},
		}),
		[tokenChartData, stateStore.language, typeTheme, isMobile, is2Xl]
	);

	const columns = useMemo(
		() => [
			{
				key: 'symbol',
				title: <span className="text-table-header">{t('token')}</span>,
				dataIndex: 'symbol',
				render: (symbol) => (
					<div className="font-normal text-[14px] text-primary">
						<CoinIcon symbol={symbol} size={28} />
						<span className="ml-2">{symbol}</span>
					</div>
				),
				sorter: true,
				sortOrder: ordering === '-symbol' ? 'descend' : ordering === 'symbol' ? 'ascend' : false,
			},
			{
				key: 'total',
				title: <span className="text-table-header">{t('total')}</span>,
				dataIndex: 'total',
				render: (total) => <p className="font-normal text-[14px] text-primary">{parseFloat(total)}</p>,
				sorter: true,
				sortOrder: ordering === '-total' ? 'descend' : ordering === 'total' ? 'ascend' : false,
			},
			{
				key: 'free',
				title: <span className="text-table-header">{t('available')}</span>,
				dataIndex: 'free',
				render: (free) => <p className="font-normal text-[14px] text-primary">{parseFloat(free)}</p>,
				sorter: true,
				sortOrder: ordering === '-free' ? 'descend' : ordering === 'free' ? 'ascend' : false,
			},
			{
				key: 'locked',
				title: <span className="text-table-header">{t('In Order')}</span>,
				dataIndex: 'locked',
				render: (locked) => <p className="font-normal text-[14px] text-primary">{parseFloat(locked)}</p>,
				sorter: true,
				sortOrder: ordering === '-locked' ? 'descend' : ordering === 'locked' ? 'ascend' : false,
			},
			{
				key: 'asset_usdt',
				title: <span className="text-table-header">{t('value')}</span>,
				dataIndex: 'asset_usdt',
				render: (asset_usdt, { asset_btc }) => (
					<div>
						<div className="flex gap-1 items-center font-normal text-[14px] text-primary">
							<BTCIcon width={20} height={20} />
							{asset_btc || 0}
						</div>
						<div className="font-normal text-[14px] text-primary">
							≈ {stateStore.getCurrency(asset_usdt || 0, exchangeInfo?.exchange)}
						</div>
					</div>
				),
				sorter: true,
				sortOrder: ordering === '-asset_usdt' ? 'descend' : ordering === 'asset_usdt' ? 'ascend' : false,
			},
		],
		[stateStore.language, ordering, exchangeInfo]
	);
	// const currentLegends = legendItemArray.map((item) => item[0]);

	const handleOnClickLegend = (type) => {
		const plot = plotRef.current;
		if (!plot) {
			return;
		}
		const elements = plot.chart.getElements();
		elements.forEach((element) => {
			if (element.data.type === type) {
				element.setState('active', true);
			} else {
				element.setState('active', false);
			}
		});
	};

	const updateExchangeDetail = () => {
		try {
			if (exchangeName !== prevExchangeName.current) {
				exchangeService.updateExchange(exchangeId, { name: exchangeName });
			}
		} catch (error) {
			toastify.error(error.errorMessage);
		} finally {
			setEnableEdit(false);
		}
	};

	const handleBlur = () => {
		updateExchangeDetail();
	};

	return (
		<>
			{' '}
			{loading ? (
				<div className="h-screen flex items-center justify-center">
					<Loading size="large" />
				</div>
			) : (
				<div className="px-4 md:px-8">
					<div className="flex gap-4 items-center card-primary justify-between md:justify-start p-2 md:p-4 md:py-[26px]">
						<div className="flex-1 flex flex-row overflow-hidden">
							<Image
								className="w-[20px] md:w-[32px] mr-2 object-contain"
								src={handleGetExchangeLogo(exchangeInfo?.exchange)}
								alt="ExchangeImage"
							/>
							<div className="flex-1">
								<Input
									className={`
									${enableEdit ? 'border-b-4' : ''}
										 border-0 text-primary font-semibold lg:text-xl mb-0 p-0`}
									value={exchangeName}
									ref={inputRef}
									onChange={(e) => setExchangeName(e.target.value)}
									disabled={!enableEdit}
									onPressEnter={() => updateExchangeDetail()}
									onBlur={handleBlur}
									suffix={
										<EditOutlined
											onClick={() => {
												setTimeout(() => {
													setEnableEdit(!enableEdit);
													inputRef.current.focus({
														cursor: 'end',
													});
												}, 200);
											}}
										/>
									}
								/>
								<p className="text-gray-400 lg:text-md mb-0 overflow-hidden whitespace-nowrap text-ellipsis">
									{`${
										exchangeInfo?.exchange !== 'bingx'
											? uppercaseFirstLetter(exchangeInfo?.exchange)
											: 'BingX'
									} ${uppercaseFirstLetter(exchangeInfo?.mode)} ${
										exchangeInfo?.mode === 'future' ? 'USDT-M' : ''
									}`}
								</p>
							</div>
						</div>
						<div className="flex gap-4">
							<button
								className="inline-flex items-center justify-center border-r-0 rounded-l"
								onClick={() => history.push(`/exchanges?selected=${exchangeInfo.id}#form`)}
								data-qa="exchange-edit-button"
								disabled={reSyncingExchange}
							>
								<EditIcon color={typeTheme === 'dark' ? '#8188A9' : '#A5ADCF'} />
							</button>
							<button
								className="inline-flex items-center justify-center border-r-0"
								onClick={() => handleDeleteExchange(exchangeId)}
								data-qa="exchange-delete-button"
								disabled={reSyncingExchange}
							>
								<DeleteIcon color={typeTheme === 'dark' ? '#8188A9' : '#A5ADCF'} />
							</button>
							<button
								className="inline-flex items-center justify-center rounded-r"
								onClick={() => {
									setReSyncingExchange(true);
									reSyncExchange().finally(() => setReSyncingExchange(false));
								}}
								data-qa="exchange-refresh-button"
								disabled={reSyncingExchange}
							>
								<ReSyncIcon
									className={`${reSyncingExchange ? 'animate-spin' : ''}`}
									color={typeTheme === 'dark' ? '#8188A9' : '#A5ADCF'}
								/>
							</button>
						</div>
					</div>
					<div className="card-primary flex flex-col md:flex-row justify-center mt-4">
						<div>
							<PieMemo {...config} />
						</div>

						{isMobile && (
							<div className="text-center mt-4">
								<p className="text-fifth font-bold text-[27px]">
									{stateStore.getCurrency(
										exchangeInfo?.total_balance_to_usd || 0,
										exchangeInfo?.exchange
									)}
								</p>
							</div>
						)}

						<div className="flex flex-col justify-center gap-4 mt-5 md:mt-0">
							{legendItemArray.map((data, i) => (
								<div
									className="flex justify-between md:grid md:grid-cols-3 md:grid-flow-row md:justify-items-start md:px-0 px-[48px]"
									key={i}
									onMouseOver={() => {
										handleOnClickLegend(data[0]);
									}}
									onFocus={() => handleOnClickLegend(data[0])}
								>
									<div className="md:col-span-2 flex flex-row items-center gap-2">
										<div
											className="w-[20px] h-[20px] rounded-full"
											style={{ backgroundColor: getColorPieChart(i + 1) }}
										/>
										<span className="text-secondary">{data[0]}</span>
									</div>
									<div className="md:col-span-1 flex-none w-[55px]">
										<span>{data[1]}%</span>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="card-primary mt-4">
						<div className="flex justify-between items-center gap-4">
							<p className="font-semibold text-lg text-primary">{t('Balance')}</p>
							<RangePicker
								getPopupContainer={(trigger) => trigger.parentElement}
								locale={getLocaleDatePicker(stateStore.language)}
								className="w-full xl:w-[300px]"
								popupClassName="w-screen md:w-fit"
								placeholder={[t('From date'), t('To date')]}
								format="DD-MM-YYYY"
								value={balanceFilter.time_range}
								onChange={(time_range) => setBalanceFilter({ ...balanceFilter, time_range })}
								// disabledDate={(date) =>
								// 	date.unix() > Date.now() / 1000 ||
								// 	date.startOf('day').unix() <
								// 		dayjs(parseInt(exchangeInfo.created) * 1000)
								// 			.startOf('day')
								// 			.unix()
								// }
								panelRender={panelRender}
							/>
						</div>
						<div className="mt-8 h-[362px]">
							{balanceData.length > 0 && balanceData.findIndex((v) => parseInt(v) !== 0) !== -1 ? (
								<AccountBalanceChart data={balanceData} exchangeInfo={exchangeInfo} />
							) : (
								<div className="h-full flex items-center justify-center opacity-60 flex-col">
									<NoDataYetIcon />
									<span className="text-sm">{t('no_data_yet')}</span>
								</div>
							)}
						</div>
					</div>
					<div className="card-primary mt-4">
						<div className="flex items-center">
							<Input
								suffix={<SearchOutlined />}
								className="w-full md:w-[300px] mr-8"
								placeholder={t('search')}
								onChange={(e) => {
									setFilter(e.target.value);
								}}
								onPressEnter={() => {
									setCurrentPage(1);
									loadToken(1, ordering);
								}}
								data-qa="exchange-token-filter-input"
							/>
						</div>
						<div className="mt-4">
							<Table
								columns={columns}
								dataSource={tokens}
								showSorterTooltip={false}
								scroll={{ x: 700 }}
								locale={{
									emptyText: t('no_data_yet'),
									triggerDesc: t('trigger_desc'),
									triggerAsc: t('trigger_asc'),
									cancelSort: t('cancel_sort'),
								}}
								onChange={(pagination, filters, sorter) => {
									if (sorter) {
										let sortOrder = sorter.columnKey;
										if (ordering.includes(sorter.columnKey)) {
											if (ordering.startsWith('-')) {
												sortOrder = sorter.columnKey;
											} else {
												sortOrder = `-${sorter.columnKey}`;
											}
										}

										setOrdering(sortOrder);
										setCurrentPage(1);
										loadToken(1, sortOrder);
									}
								}}
								pagination={false}
								data-qa="coins-bought-table"
							/>
						</div>

						<CustomPagination
							className="p-4"
							total={total}
							currentPage={currentPage}
							pageSize={pageSize}
							onChange={(page) => {
								setCurrentPage(page);
								loadToken(page, ordering);
							}}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default observer(withTranslation()(ExchangeDetail));
