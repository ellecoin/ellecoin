import React, { useState, useEffect, useRef, useContext, memo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Steps, Form, Button, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import useDidMount from 'beautiful-react-hooks/useDidMount';
import { FORM_STEP, initFormValues, BOT_ACTION, getThemeConfig } from '../helper';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import exchangeService from '../../../../services/ExchangeService';
import botService from '../../../../services/BotService';
import { useStore } from '../../../../context/AppContext';
import Loading from '../../../../components/Loading';
import { ThemeContext } from '../../../../context/ThemeContext';
import { toastify } from '../../../../components/Toastify';
import { useLayoutContext } from '../../../../context/LayoutContext';

const CreateBot = () => {
	const { t } = useTranslation();
	const { stateStore } = useStore();
	const { action, botId } = useParams();
	const history = useHistory();
	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const [exchanges, setExchanges] = useState([]);
	const [integratedExchanges, setIntegratedExchanges] = useState([]);
	const [errorFields, setErrorFields] = useState();
	const [initing, setIniting] = useState(true);
	const [loading, setLoading] = useState(false);
	const selectedExchangeId = Form.useWatch('my_exchange', form);
	const currentBotInfo = useRef();
	const { typeTheme } = useContext(ThemeContext);
	const [errors, setErrors] = useState({});
	const ref = useRef(null);
	const { COPY, DUPLICATE, UPDATE } = BOT_ACTION;
	const [oldBotName, setOldBotName] = useState('');
	const { onChangeModalConfigs } = useLayoutContext();
	const [width, setWidth] = useState(0);
	const [orgExchange, setOrgExchange] = useState(null);

	const themeConfig = getThemeConfig(typeTheme);

	useDidMount(() => {
		if (action === UPDATE && botId) {
			stateStore.setHeaderTitle(t('update_bot'));
		} else {
			stateStore.setHeaderTitle(t('create_bot'));
		}
	});

	useEffect(() => {
		const errorFields = form.getFieldsError().reduce((arr, field) => {
			if (field.errors.length) {
				arr.push(field.name);
			}
			return arr;
		}, []);
		form.validateFields(errorFields);
	}, [stateStore.language]);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;
		const resizeObserver = new ResizeObserver(() => {
			setWidth(element.clientWidth);
		});
		resizeObserver.observe(element);
		return () => resizeObserver.disconnect();
	}, [ref]);

	useEffect(() => {
		const futureEnableFilterForExchange = { mode: 'spot' };
		Promise.all([
			exchangeService.getMyExchangesSupportFilter(futureEnableFilterForExchange).then(({ results }) => results), // get My Exchange list ( Step 1 )
			exchangeService.getIntegratedExchanges().then(({ results }) => results), // get Exchange list ( Step 2 )
			// tickerService.getTickerPreset().then(({ results }) => results),
			// tickerService.getDynamicPreset().then(({ results }) => results),
			new Promise((resolve, reject) => {
				if ((action === UPDATE || action === DUPLICATE) && botId) {
					botService
						.getBotDetail(botId)
						.then((res) => resolve(res))
						.catch((err) => reject(err));
				} else if (action === COPY && botId) {
					botService
						.getBotTemplateDetail(botId)
						.then((res) => resolve(res))
						.catch((err) => reject(err));
				} else {
					resolve();
				}
			}),
		])
			.then(([exchanges, integratedExchanges, botInfo]) => {
				setExchanges(exchanges);
				setIntegratedExchanges(integratedExchanges);

				if (action !== UPDATE && action !== COPY && action !== DUPLICATE) {
					const commonInfo = {
						my_exchange: exchanges[0]?.id,
						pair_with:
							integratedExchanges.find(({ exchange }) => exchange === exchanges[0]?.exchange)
								?.trading_pairs?.[0]?.quote || 'USDT',
					};

					const exchangeMapped = integratedExchanges.find(
						({ exchange, mode }) => exchange === exchanges[0].exchange && mode === exchanges[0].mode
					);

					setOrgExchange(exchangeMapped);

					const commonPresetData = {
						exchange: exchangeMapped.id,
						pair_with: commonInfo.pair_with,
					};

					form.setFieldsValue({
						...form.getFieldsValue(),
						...commonInfo,
						...commonPresetData,
					});
				}

				if (action === UPDATE || action === COPY || action === DUPLICATE) {
					currentBotInfo.current = botInfo;

					const myExchangeId =
						botInfo?.my_exchange?.id || exchanges.find(({ exchange }) => exchange === botInfo.exchange)?.id;
					const exchangeMapped = integratedExchanges.find(
						({ exchange, mode }) =>
							exchange === botInfo?.my_exchange?.exchange_code &&
							mode === botInfo?.my_exchange.exchange_mode
					);
					setOrgExchange(exchangeMapped);

					setOldBotName(botInfo?.name);
					form.setFieldsValue({
						...form.getFieldsValue(),
						...(action === UPDATE ? { name: botInfo?.name } : {}),
						tickers: botInfo.fixed_tickers.tickers,
						my_exchange: myExchangeId,
						pair_with: botInfo.pair_with || 'USDT',
						quantity: botInfo.quantity || 15,
						max_coins: botInfo.max_coins || 15,
						time_difference: botInfo.time_difference || 10,
						recheck_interval: botInfo.recheck_interval || 10,
						change_in_price: botInfo.change_in_price || 5,
						stop_loss: parseFloat(botInfo?.stop_loss) || 5,
						take_profit: parseFloat(botInfo?.take_profit) || 8,
						avg_trend_daily: botInfo.avg_trend_daily || 50,
						num_top_coin: botInfo.num_top_coin || 2,
						btc_ma_sell: botInfo.btc_ma_sell || 7,
						use_traling_stoploss: botInfo.use_traling_stoploss,
						trailing_stop_loss: botInfo.trailing_stop_loss || 0.4,
						trailing_take_profit: botInfo.trailing_take_profit || 0.1,
						indicator_preset: botInfo.indicator_preset?.id,
						investment: botInfo.investment || 250,
						base_order_amount: botInfo.base_order_amount || 15,
						time_interval: botInfo.time_interval || 15,
						number_of_sample: botInfo.number_of_sample || 10,
						stop_loss_percentage: botInfo.stop_loss_percentage || 15,
						take_profit_percentage: botInfo.take_profit_percentage || 3,
						use_target_total_profit: botInfo.use_target_total_profit,
						target_total_profit: botInfo.target_total_profit || 30,
						use_allowed_total_loss: botInfo.use_allowed_total_loss,
						allowed_total_loss: botInfo.allowed_total_loss || 30,
						use_time_cooldown: botInfo.use_time_cooldown,
						time_cooldown: botInfo.time_cooldown || 1800,
						use_time_close_deal: botInfo.use_time_close_deal,
						time_close_deal: botInfo.time_close_deal || 604800,
						use_minimum_profit: botInfo?.use_minimum_profit,
						minimum_profit_percentage: botInfo?.minimum_profit_percentage || 1,
						strategy: botInfo?.strategy || 'LONG',
						leverage_type: botInfo?.leverage_type || 'cross',
						leverage: botInfo?.leverage || 1,
					});
				}
			})
			.finally(() => {
				setIniting(false);
			});
	}, []);

	const handleNext = async () => {
		try {
			setLoading(true);
			await form.validateFields();
			setErrorFields(null);
			setCurrentStep(currentStep + 1);
		} catch (e) {
			let element = document.getElementsByClassName('ant-form-item-has-error')?.[0];
			if (!element) {
				element = document.getElementsByClassName('rule_item_wrapper border-[red]')?.[0];
			}
			if (element) {
				const distance = window.scrollY - element.offsetTop;
				window.scroll({ top: distance, left: 0, behavior: 'smooth' });
			}

			setErrorFields(
				e.errorFields.reduce((result, { name }) => {
					result[name[0]] = true;
					return result;
				}, {})
			);
		}
		setLoading(false);
	};

	const handleCreateBot = (values) => {
		setLoading(true);
		return botService
			.createBot(values)
			.then(() => {
				history.replace('/bots');
			})
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

	const handleUpdateBot = (values) => {
		setLoading(true);
		return botService
			.updateBot(botId, values)
			.then(() => {
				history.goBack();
			})
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

	const handlePresetValue = (values) => {
		// 1.1 Fixed: fixed_tickers
		const { tickers, pair_with } = values;

		console.log(values);
		console.log(orgExchange);
		const fixed_tickers = {
			tickers: tickers?.join(', '),
			pair: pair_with,
			exchange: orgExchange.id,
		};

		const submitValues = {
			...values,
			...(tickers ? { fixed_tickers } : {}),
		};

		delete submitValues.tickers;

		return submitValues;
	};

	const handleSubmit = async () => {
		try {
			setErrors({});
			const values = await form.getFieldsValue();
			const convertValues = handlePresetValue(values);

			if (action === UPDATE) {
				handleUpdateBot(convertValues);
			} else {
				handleCreateBot(convertValues);
			}
		} catch (e) {
			// TODO
			toastify.error('handleSubmit');
			console.log('Error', e);
		}
	};

	const getDefaultPairWith = (newList, value) => {
		if (newList.includes(value)) return value;
		return newList[0];
	};

	const handleChangeExchange = (onChooseExchangeId) => {
		const values = form.getFieldsValue();

		const getPairWithList = (exchangeId) =>
			integratedExchanges
				.find(
					({ exchange, mode }) =>
						exchange === exchanges.find(({ id }) => id === exchangeId)?.exchange &&
						mode === exchanges.find(({ id }) => id === exchangeId)?.mode
				)
				.trading_pairs.reduce((acc, pair) => [...acc, pair.quote], []);

		const newPairWithList = getPairWithList(onChooseExchangeId);

		const pairWith = getDefaultPairWith(newPairWithList, values.pair_with);

		const findExchangeModeById = (id) => {
			const exchangeMode = exchanges.find(({ id: exchangeId }) => exchangeId === id);
			return exchangeMode ? { exchange: exchangeMode.exchange, mode: exchangeMode.mode } : null;
		};

		const exchangeMapped = integratedExchanges.find(({ exchange, mode }) => {
			const selectedExchange = findExchangeModeById(onChooseExchangeId);
			return selectedExchange && exchange === selectedExchange.exchange && mode === selectedExchange.mode;
		});

		setOrgExchange(exchangeMapped);

		const preExchange = findExchangeModeById(selectedExchangeId);

		const isSameExchange =
			preExchange.exchange === exchangeMapped.exchange && preExchange.mode === exchangeMapped.mode;

		const updateInfo = {
			pair_with: pairWith,
			fixed_tickers: {
				tickers: isSameExchange ? currentBotInfo.current?.fixed_tickers?.tickers : [],
			},
		};
		form.setFieldsValue({
			...values,
			...updateInfo,
		});
	};

	const handleChangePair = (pairWith) => {
		const values = form.getFieldsValue();
		const updateInfo = {
			whitelist_ticker_info: {
				...values.whitelist_ticker_info,
				pair_with: pairWith,
			},
			blacklist_ticker_info: {
				...values.blacklist_ticker_info,
				pair_with: pairWith,
			},
		};
		form.setFieldsValue({ ...values, ...updateInfo });
	};

	const onValuesChange = (v) => {
		setErrors({});
		if (v.my_exchange) {
			handleChangeExchange(v.my_exchange);
		} else if (v.pair_with) {
			handleChangePair(v.pair_with);
		} else if (v.investment || v.base_order_amount) {
			form.validateFields().then(() => {});
		}
	};

	useEffect(() => {
		if (action === DUPLICATE && botId && oldBotName) {
			botService
				.autoGenerateBotname({ bot_name: oldBotName })
				.then((res) => {
					form.setFieldsValue({ name: res?.bot_name });
				})
				.catch((err) => console.log(err));
		}
	}, [action, botId, oldBotName]);

	return (
		<ConfigProvider theme={themeConfig}>
			<div ref={ref}>
				<Form form={form} initialValues={initFormValues} onValuesChange={(v) => onValuesChange(v)}>
					{initing ? (
						<div className="h-screen flex items-center justify-center">
							<Loading />
						</div>
					) : (
						<div className="px-4 md:px-6">
							<Steps
								current={currentStep}
								items={FORM_STEP.map((step) => ({
									...step,
									title: t(step.title),
								}))}
								className="w-1/2"
							/>
							<div className="mt-8">
								<div className={currentStep === 0 ? 'py-[32px]' : 'hidden'}>
									<StepOne
										exchanges={exchanges}
										integratedExchanges={integratedExchanges}
										botNameValidate={(value) => {
											if (action === UPDATE && value === currentBotInfo.current?.name) {
												return Promise.resolve();
											}
											return botService
												.validateBotName(value)
												.then(() => Promise.resolve())
												.catch(() => Promise.reject(t('bot_name_already_exists')));
										}}
									/>
								</div>
								<div className={currentStep === 1 ? 'py-[32px]' : 'hidden'}>
									<StepTwo
										exchange={exchanges.find((exchange) => exchange.id === selectedExchangeId)}
										disableValidate={currentStep < 2}
										editMode={action === UPDATE}
										errors={errors}
									/>
								</div>
							</div>
						</div>
					)}
				</Form>
				{!initing && ref.current && (
					<div
						className="fixed bottom-0 card-primary flex justify-end gap-2 rounded-[0px]"
						style={{ width: `${width}px` }}
					>
						{currentStep > 0 && (
							<Button
								className="button-primary-outline--default h-10 w-full md:w-auto px-6 py-3 min-w-[187px]"
								onClick={() => setCurrentStep(currentStep - 1)}
								data-qa="create-bot-prev-button"
							>
								{t('previous')}
							</Button>
						)}
						{currentStep < 1 && (
							<Button
								className="button-primary h-10 w-full md:w-auto min-w-[187px]"
								type="primary"
								onClick={() => handleNext()}
								data-qa="create-bot-next-button"
								loading={loading}
							>
								{t('next')}
							</Button>
						)}
						{currentStep === 1 && (
							<Button
								type="primary"
								className="button-primary h-10 w-full md:w-auto min-w-[187px]"
								data-qa="create-bot-submit-button"
								loading={loading}
								onClick={() => handleSubmit()}
							>
								{action === UPDATE ? t('update') : t('create')}
							</Button>
						)}
					</div>
				)}
			</div>
		</ConfigProvider>
	);
};

export default memo(CreateBot);
