import React, { useState, useEffect } from 'react';
import { Select, Form, ConfigProvider } from 'antd';
import { withTranslation } from 'react-i18next';
import stringSimilarity from 'string-similarity';
import CoinIcon from '../../../../components/CoinIcon';
import tickerService from '../../../../services/TickerService';
import Loading from '../../../../components/Loading';

const TickerFilterView = ({ t, filterType, formWrapper, exchanges, disableValidate = false, viewOnly = false }) => {
	const [tickerOptions, setTickerOptions] = useState();
	const [searching] = useState(false);
	const [allCoins, setAllCoins] = useState([]);
	const instance = Form.useFormInstance();
	const exchangeId = Form.useWatch([formWrapper, 'exchange'], instance);
	const pairWith = Form.useWatch([formWrapper, 'pair_with'], instance);
	const tickers = Form.useWatch([formWrapper, 'tickers'], instance);
	const loadCoins = (exchangeId, pair) => {
		tickerService
			.searchSymbol(exchanges.find(({ id }) => id === exchangeId)?.exchange, {
				pair,
				limit: 10000,
			})
			.then(({ results }) => {
				setAllCoins(results);
			});
	};

	useEffect(() => {
		if (exchangeId) {
			loadCoins(exchangeId, pairWith);
		}
	}, [exchangeId, pairWith]);

	const searchFixedTicker = (keyword) => {
		setTickerOptions(
			allCoins
				.filter(({ base }) => base?.toLowerCase().includes(keyword?.toLowerCase()))
				.map(({ base, quote }) => {
					const score = stringSimilarity.compareTwoStrings(base.toLowerCase(), keyword?.toLowerCase());
					return {
						base,
						quote,
						score,
					};
				})
				.sort((s1, s2) => (s1.score < s2.score ? 1 : -1))
		);
	};

	const themeConfig = {
		components: {
			Input: {
				controlHeight: 40,
			},
			InputNumber: {
				controlHeight: 40,
			},
			Select: {
				controlHeight: 40,
			},
		},
	};

	return (
		<div>
			<ConfigProvider theme={themeConfig}>
				<div className="mt-4">
					<div className="mt-2">
						<p className="text-secondary mb-[10px] text-[16px]">{t('tickers')}</p>
						<ConfigProvider
							theme={{
								components: {
									Select: {
										controlHeight: 60,
									},
								},
							}}
						>
							<Form.Item
								name={[formWrapper, 'tickers']}
								rules={[
									{
										required: filterType === 'fixed' && !disableValidate,
										message: t('fixed_ticker_require'),
									},
								]}
							>
								<Select
									className="w-full selectTicker"
									mode="multiple"
									placeholder={t('select_tickers')}
									filterOption={false}
									onSearch={(value) => {
										searchFixedTicker(value);
									}}
									notFoundContent={searching ? <Loading size="small" /> : null}
									options={(tickerOptions || tickers?.map((ticker) => ({ base: ticker })) || []).map(
										({ base }) => ({
											key: base,
											label: (
												<div className="flex items-center">
													<span className="mr-2">
														<CoinIcon symbol={base.toLowerCase()} size={18} />
													</span>
													<span>{base}</span>
												</div>
											),
											value: base,
										})
									)}
									disabled={viewOnly}
									data-qa="ticker-select"
									popupClassName="ticker-select"
								/>
							</Form.Item>
						</ConfigProvider>
					</div>
				</div>
			</ConfigProvider>
		</div>
	);
};

export default withTranslation()(TickerFilterView);
