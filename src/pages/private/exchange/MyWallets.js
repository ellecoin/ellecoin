import React, { useState, useEffect, useMemo, useRef, useContext, memo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Select, Input, Button, Form, ConfigProvider, Popover, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { CloseOutlined, PlusOutlined, SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import { observer } from 'mobx-react';
import MyWalletsSlider from './MyWalletsSlider';
import Image from '../../../components/Image';
import { handleGetExchangeLogo } from '../../../utils/helper';
import exchangeService from '../../../services/ExchangeService';
import botService from '../../../services/BotService';
import Loading from '../../../components/Loading';
import { ThemeContext } from '../../../context/ThemeContext';
import { themeObject } from '../../../styles/themes/themeVariables';
import FilterICon from '../../../assets/icons/FilterIcon';
import { useStore } from '../../../context/AppContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { MARKET_MODE, MARKET_MODE_OPTS } from '../../../constants/constants';
import { CancelButton } from '../../../components';
import { useLayoutContext } from '../../../context/LayoutContext';
import SupportExchanges from './components/SupportExchanges';
import { siteConfig } from '../../../data/SiteConfig';

const { Option } = Select;

const MyWallets = () => {
	const { t } = useTranslation();
	const { search } = useLocation();
	const history = useHistory();
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const { isDesktop } = useResponsive();
	const pageSize = isDesktop ? 8 : 3;
	const { stateStore, authStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);
	const { supportExchanges } = siteConfig;
	const [exchanges, setExchanges] = useState([]);
	const [filter, setFilter] = useState({
		offset: 0,
		limit: pageSize,
	});
	const [filterVisible, setFilterVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingExchange, setLoadingExchange] = useState(false);
	const [editing, setEditing] = useState(false);
	const [selectedExchange, setSelectedExchange] = useState(null);
	const [form] = Form.useForm();
	const refreshBalanceTimeouts = useRef([]);
	const exchange = Form.useWatch('exchange', form);
	const nameInputRef = useRef();
	const [errors, setErrors] = useState({});
	const [isDeleting, setIsDeleting] = useState(false);
	const [exchangesTotal, setExchangesTotal] = useState(0);
	const prevExchangeIdList = useRef([]);
	const isDemoAccount = useMemo(() => authStore?.user?.demo_mode, [authStore?.user?.demo_mode]);
	const { onChangeModalConfigs } = useLayoutContext();
	const themeConfigParent = {
		components: {
			Dropdown: {
				borderRadiusLG: 12,
				borderRadiusSM: 12,
				boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowSecondary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				boxShadowTertiary: '0px 4px 30px rgba(0, 0, 0, 0.25)',
				colorBgMask: themeObject[typeTheme].colorBgDropdown,
				colorBgElevated: themeObject[typeTheme].colorBgDropdown,
			},
		},
	};

	const themeConfig = {
		components: {
			Input: {
				controlHeight: 60,
				fontSize: 16,
				colorIcon: themeObject[typeTheme].colorIconEyeInput,
				colorIconHover: themeObject[typeTheme].colorIconEyeInput,
			},
			Select: {
				fontSize: 16,
				controlHeight: 60,
			},
		},
	};

	const loadMyExchange = () => {
		setLoadingExchange(true);
		return exchangeService
			.getMyExchanges({
				name: filter.name || undefined,
				exchange_code: filter.exchange_code || undefined,
				mode: filter.mode || 'all',
				...filter,
			})
			.then(({ results, count = 0 }) => {
				setExchangesTotal(count);
				setExchanges(results);
				return { results };
			});
	};

	const handleSearchMobile = () => {
		setFilterVisible(false);
		loadMyExchange()
			.then(({ results }) => {
				const selectedId = query.get('selected');
				if (selectedId) {
					const exchange = results.find((exchange) => `${exchange.id}` === selectedId);
					if (exchange && !selectedExchange) {
						setSelectedExchange(exchange);
						form.setFieldsValue(exchange);
						setEditing(true);
						nameInputRef.current.focus();
						window.scroll({ top: 300, behavior: 'smooth' });
					} else if (!selectedExchange) {
						history.replace('/exchanges');
					}
				}
			})
			.finally(() => setLoadingExchange(false));
	};

	const refreshBalance = (exchangeIdList, exchanges) => {
		exchangeIdList.forEach((ex) => {
			exchangeService.getExchangeInfo(ex).then(({ total_balance_to_usd }) => {
				setExchanges(
					exchanges.map((exchange) => {
						if (exchange.id === ex) {
							exchange.total_balance_to_usd = total_balance_to_usd;
						}
						return exchange;
					})
				);
			});
		});
	};

	const handleCreateExchange = (values) => {
		setLoading(true);
		exchangeService
			.createExchange(values)
			.then(() => {
				form.resetFields();
				loadMyExchange();
			})
			.catch(({ errors }) => {
				if (errors) {
					setErrors(errors);
				}
				onChangeModalConfigs({
					open: true,
					title: t('error'),
					children: errors?.message,
					type: 'error',
				});
			})
			.finally(() => {
				setLoading(false);
				setLoadingExchange(false);
			});
	};

	const handleUpdateExchange = (exchangeId, values) => {
		setLoading(true);
		exchangeService
			.updateExchange(exchangeId, values)
			.then(() =>
				onChangeModalConfigs({
					open: true,
					type: 'success',
					title: t('update_successful'),
					children: t('update_exchange_success'),
					onOk: () => {
						setExchanges(
							exchanges.map((exchange) =>
								exchange.id === exchangeId
									? {
											...exchange,
											...values,
											total_balance_to_usd: 0,
											latest_updated: null,
									  }
									: exchange
							)
						);
						setEditing(false);
						form.resetFields();
					},
				})
			)
			.catch(({ errors }) => {
				if (errors) {
					setErrors(errors);
				}
				onChangeModalConfigs({
					open: true,
					title: t('error'),
					children: errors?.message,
				});
			})
			.finally(() => setLoading(false));
	};

	const handleDeleteExchange = (exchangeId) => {
		if (!isDeleting) {
			setIsDeleting(true);
			botService
				.getBots({
					exchange: exchangeId,
				})
				.then(({ results }) => {
					onChangeModalConfigs({
						open: true,
						title: t('delete_confirm'),
						type: 'error',
						children:
							results.length > 0 ? (
								<div>
									<p>{t('delete_exchange_with_bot')}</p>
									<ul className="list-disc pl-4">
										{results.map((bot) => (
											<li className="list-disc" key={bot.id}>
												{bot.name}
											</li>
										))}
									</ul>
								</div>
							) : (
								t('delete_exchange_without_bot')
							),

						onOk: () => {
							exchangeService
								.deleteExchange(exchangeId)
								.then(() => {
									setExchanges(exchanges.filter((exchange) => exchange.id !== exchangeId));
								})
								.catch(({ errors }) => {
									onChangeModalConfigs({
										open: true,
										title: t('error'),
										children: errors?.message,
									});
								});
						},
					});
				})
				.finally(() => setIsDeleting(false));
		}
	};

	const onChangeFilter = (updateFilter) => setFilter({ ...filter, ...updateFilter });

	useEffect(() => {
		const errorFields = form.getFieldsError().reduce((arr, field) => {
			if (field.errors.length) {
				arr.push(field.name);
			}
			return arr;
		}, []);
		form.validateFields(errorFields);
	}, [stateStore.language]);

	const getFilterView = () => (
		<div className="md:flex gap-2 space-y-2 md:space-y-0">
			<Input
				className="w-full xl:min-w-[240px]"
				placeholder={t('Search by name')}
				suffix={<SearchOutlined />}
				onBlur={(e) => {
					if (e.target.value !== filter.name) {
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
				onChange={(exchange) => setFilter({ ...filter, exchange_code: exchange })}
				onClear={() => setFilter({ ...filter, exchange_code: undefined })}
				data-qa="exchange-select"
				popupClassName="exchange-select"
				showSearch
				disabled={loadingExchange}
			>
				{siteConfig.supportExchanges.map(({ code, name }) => (
					<Option key={code} value={code}>
						<div className="flex items-center h-full">
							<Image className="w-[20px] mr-2" src={handleGetExchangeLogo(code)} alt={name} />
							<p className="m-0">{name}</p>
						</div>
					</Option>
				))}
			</Select>
			{/* <Select */}
			{/*	className="w-full xl:min-w-[240px]" */}
			{/*	placeholder={t('trading_type')} */}
			{/*	onChange={(type) => setFilter({ ...filter, mode: type })} */}
			{/*	onClear={() => setFilter({ ...filter, mode: MARKET_MODE.spot })} */}
			{/*	data-qa="trading-type-select" */}
			{/*	popupClassName="trading-type-select" */}
			{/*	options={MARKET_MODE_OPTS} */}
			{/*	defaultValue={MARKET_MODE.spot} */}
			{/* /> */}
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

	useEffect(() => {
		loadMyExchange()
			.then(({ results }) => {
				prevExchangeIdList.current = results.map((i) => i.id);

				const selectedId = query.get('selected');
				if (selectedId) {
					const exchange = results.find((exchange) => `${exchange.id}` === selectedId);
					if (exchange && !selectedExchange) {
						setSelectedExchange(exchange);
						form.setFieldsValue(exchange);
						setEditing(true);
						nameInputRef.current.focus();
						window.scroll({ top: 300, behavior: 'smooth' });
					} else if (!selectedExchange) {
						history.replace('/exchanges');
					}
				}
			})
			.finally(() => setLoadingExchange(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter]);

	useEffect(() => {
		if (prevExchangeIdList.current?.length < exchanges?.length) {
			const exchangeIdList = exchanges.map((i) => i.id);
			const differentElements = exchangeIdList
				.filter((element) => !prevExchangeIdList.current.includes(element))
				.concat(prevExchangeIdList.current.filter((element) => !exchangeIdList.includes(element)));
			const timeout = setTimeout(() => refreshBalance(differentElements, exchanges), 2000);
			refreshBalanceTimeouts.current.push(timeout);
			prevExchangeIdList.current = exchangeIdList;
		}
	}, [prevExchangeIdList, exchanges]);

	return (
		<ConfigProvider theme={themeConfigParent}>
			<div className="px-4 md:px-8 my_exchange">
				<div className="flex justify-between items-center gap-2">
					<div className="hidden lg:block mb-4">{getFilterView()}</div>
					<div className="mb-4 flex-1 flex md:justify-end justify-start">
						<Button
							className={`${
								!isDemoAccount ? 'button-primary--connect' : 'button-primary--disabled'
							}  flex items-center w-full md:w-auto border-none`}
							type="primary"
							onClick={async () => {
								setEditing(false);
								await form.resetFields();
								history.replace('/exchanges');
								nameInputRef.current.focus();
								document.getElementById('exchange-name-input').scrollIntoView({
									behavior: 'smooth',
									block: 'center',
									inline: 'center',
								});
							}}
							icon={<PlusOutlined />}
							disabled={isDemoAccount}
						>
							{t('Connect New Account')}
						</Button>
					</div>
					<div className="lg:hidden mb-4">
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
								className="button-primary-outline--default"
								icon={<FilterICon color={typeTheme === 'dark' ? '#ffffff' : '#8188A9'} />}
							/>
						</Popover>
					</div>
				</div>
				<div className="cards-slider owl-carousel mt-2">
					{loadingExchange ? (
						<div className="h-[200px] flex items-center justify-center">
							<Loading />
						</div>
					) : (
						<MyWalletsSlider
							{...{ onChangeFilter, filter, exchangesTotal }}
							exchanges={exchanges}
							onEdit={(exchangeId) => {
								setEditing(true);
								const exchange = exchanges.find(({ id }) => id === exchangeId);
								setSelectedExchange(exchange);
								form.setFieldsValue(exchange);
								nameInputRef.current.focus();
								window.scroll({ top: 300, behavior: 'smooth' });
							}}
							onDelete={(exchangeId) => handleDeleteExchange(exchangeId)}
							isDemoAccount={isDemoAccount}
						/>
					)}
				</div>

				<div id="form" className="mt-8">
					<div className="card-primary">
						<p className="font-semibold my-4 text-primary text-[16px]">
							{editing ? t('edit_my_exchange') : t('add_new_exchange')}
						</p>

						<ConfigProvider theme={themeConfig}>
							<Form
								form={form}
								initialValues={{
									exchange: supportExchanges[0].code,
								}}
								onFinish={(values) => {
									setErrors({});
									if (editing) {
										handleUpdateExchange(selectedExchange.id, values);
									} else {
										handleCreateExchange(values);
									}
								}}
								disabled={isDemoAccount}
								onValuesChange={() => setErrors({})}
							>
								<div>
									<p className="m-0 mb-2 text-secondary text-[16px]">{t('name')}</p>
									<Form.Item
										name="name"
										rules={[{ required: true, message: t('name_must_not_be_empty') }]}
									>
										<Input
											ref={nameInputRef}
											placeholder={t('your_exchange_name')}
											data-qa="exchange-name-input"
											id="exchange-name-input"
										/>
									</Form.Item>
								</div>
								<div className="my-4">
									<p className="m-0 mb-2 text-secondary text-[16px]">{`${t('exchange')}:`}</p>
									<Form.Item name="exchange">
										<Select
											className="w-full"
											data-qa="exchange-select"
											popupClassName="exchange-select"
											disabled={isDemoAccount || editing}
											showSearch
											optionFilterProp="label"
										>
											{siteConfig.supportExchanges.map(({ code, name }) => (
												<Option key={code} value={code} label={name}>
													<div className="flex items-center h-full">
														<Image
															className="w-[20px] mr-2"
															src={handleGetExchangeLogo(code)}
															alt={name}
														/>
														<p className="m-0">{name}</p>
													</div>
												</Option>
											))}
										</Select>
									</Form.Item>
								</div>
								<div
									className={`grid grid-cols-1 ${
										exchange === 'kucoin' || exchange === 'okx' ? '' : 'lg:grid-cols-2'
									} gap-x-4`}
								>
									<div>
										<p className="m-0 mb-2 text-secondary text-[16px]">{t('api_key')}</p>
										<Form.Item
											name="api_key"
											rules={[{ required: true, message: t('api_key_warning') }]}
											validateStatus={errors.api_key ? 'error' : undefined}
											help={errors.api_key}
										>
											<Input
												placeholder={t('exchange_api_key')}
												autoComplete="off"
												data-qa="exchange-api-key-input"
											/>
										</Form.Item>
									</div>

									<div
										className={`grid grid-cols-1 ${
											exchange === 'kucoin' || exchange === 'okx' ? 'lg:grid-cols-2' : ''
										} gap-x-4`}
									>
										<div>
											<p className="m-0 mb-2 text-secondary text-[16px]">{t('api_secret')}</p>
											<Form.Item
												name="api_secret"
												rules={[{ required: true, message: t('api_secret_warning') }]}
												validateStatus={errors.api_secret ? 'error' : undefined}
												help={errors.api_secret}
											>
												<Input.Password
													placeholder={t('exchange_api_secret')}
													autoComplete="new-password"
													data-qa="exchange-secret-key-input"
												/>
											</Form.Item>
										</div>
										{(exchange === 'kucoin' || exchange === 'okx') && (
											<div>
												<p className="m-0 mb-2 text-secondary text-[16px]">
													{t('api_password')}
												</p>
												<Form.Item
													name="api_password"
													rules={[
														{
															required: exchange === 'kucoin' || exchange === 'okx',
															message: t('api_password_warning'),
														},
													]}
													validateStatus={errors.api_password ? 'error' : undefined}
													help={errors.api_password}
												>
													<Input.Password
														placeholder={t('exchange_api_password')}
														autoComplete="new-password"
														data-qa="exchange-secret-password-input"
													/>
												</Form.Item>
											</div>
										)}
									</div>
								</div>

								<div className="flex justify-end mt-4 gap-2">
									{editing && (
										<CancelButton
											onClick={() => {
												setEditing(false);
												form.setFieldsValue({
													name: '',
													exchange: 'binance',
													api_key: '',
													api_secret: '',
												});
											}}
											data-qa="exchange-cancel-button"
										/>
									)}
									<Button
										type="primary"
										htmlType="submit"
										loading={loading}
										data-qa="exchange-create-button"
										className={`${
											!isDemoAccount ? 'button-primary--connect' : 'button-primary--disabled'
										} border-none w-[94px]`}
										disabled={isDemoAccount}
									>
										{editing ? t('update') : t('create')}
									</Button>
								</div>
							</Form>
						</ConfigProvider>

						<SupportExchanges {...{ supportExchanges }} />
					</div>
				</div>
			</div>
		</ConfigProvider>
	);
};

export default memo(observer(MyWallets));
