import React, { useEffect, useRef, useContext } from 'react';
import { Radio, Input, Form, Select, ConfigProvider, Typography } from 'antd';
import { withTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import TickerFilterView from './TickerFilterView';
import CustomFormRadioGroup from '../../../../components/radio/CustomFormRadioGroup';
import tickerService from '../../../../services/TickerService';
import Image from '../../../../components/Image';
import { handleGetExchangeLogo } from '../../../../utils/helper';
import CoinIcon from '../../../../components/CoinIcon';
import { themeObject } from '../../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../../context/ThemeContext';

const CreateTickerPresetView = ({
	className,
	formWrapper,
	t,
	isUpdateMode = false,
	disableValidate = false,
	presetNameValidate,
	enableSelectExchange = true,
	exchanges,
}) => {
	const form = Form.useFormInstance();
	const filterType = Form.useWatch([formWrapper, 'filter_type']);
	const selectedExchangeId = Form.useWatch([formWrapper, 'exchange']);
	const pairWith = Form.useWatch([formWrapper, 'pair_with']);
	const prevExchange = useRef(selectedExchangeId);
	const { typeTheme } = useContext(ThemeContext);
	const isMobile = useMediaQuery('(max-width: 768px)');

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
			// updateInfo[formWrapper].tickers = [];
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

	return (
		<div className={`${className} relative`}>
			<ConfigProvider theme={themeConfig}>
				<Typography className="text-secondary mb-[10px] text-[16px]">{t('preset_name')}</Typography>
				<Form.Item
					name={[formWrapper, 'name']}
					validateTrigger={['onBlur']}
					rules={[
						{ required: !disableValidate, message: t('preset_name_require') },
						() => ({
							validator(_, value) {
								if (disableValidate || !value) {
									return Promise.resolve();
								}
								if (presetNameValidate) {
									return presetNameValidate(value, filterType);
								}

								return tickerService
									.validatePresetName(value, filterType)
									.then(() => Promise.resolve())
									.catch(() => Promise.reject(t('preset_name_already_exist')));
							},
						}),
					]}
				>
					<Input placeholder={t('Input preset name')} data-qa="preset-name-input" />
				</Form.Item>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
					<div>
						<p className="text-secondary mb-[10px] text-[16px]">{t('exchange')}</p>
						<div>
							<Form.Item
								name={[formWrapper, 'exchange']}
								rules={[{ required: true, message: t('exchange_require') }]}
								className={isMobile ? 'mb-2' : ''}
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
						<p className="text-secondary mb-[10px] text-[16px]">{t('pair_with')}</p>
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

				<div>
					<p className="text-secondary mb-[10px] text-[16px]">{t('select_the_ticker_filter_type')}</p>
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
				</div>

				<TickerFilterView
					filterType={filterType}
					formWrapper={formWrapper}
					exchanges={exchanges}
					disableValidate={disableValidate}
				/>
			</ConfigProvider>
		</div>
	);
};

export default withTranslation()(CreateTickerPresetView);
