import React, { useState, useEffect, useMemo } from 'react';
import { Select, Input, Form, Tag, Tooltip, Button } from 'antd';
import { withTranslation } from 'react-i18next';
import { InfoCircleOutlined, ClearOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import stringSimilarity from 'string-similarity';
import { uppercaseFirstLetter } from '../../../../../utils/utils';
import { handleGetExchangeLogo } from '../../../../../utils/helper';
import Image from '../../../../../components/Image';
import CoinIcon from '../../../../../components/CoinIcon';
import TickerService from '../../../../../services/TickerService';
import FixedModal from '../components/FixedModal';

const StepOne = ({ t, exchanges, integratedExchanges, botNameValidate }) => {
	const [tickerOptions, setTickerOptions] = useState();
	const [openFixedModal, setOpenFixedModal] = useState(false);
	const selectedExchangeId = Form.useWatch('my_exchange');
	const selectedPairWith = Form.useWatch('pair_with');
	const selectedTicker = Form.useWatch('tickers');
	const [allCoins, setAllCoins] = useState([]);
	const form = Form.useFormInstance();

	const exchangeInfo = useMemo(
		() => (exchanges || []).find((exchange) => exchange.id === selectedExchangeId),
		[selectedExchangeId, exchanges]
	);

	const isAllTicker = useMemo(() => allCoins.length === selectedTicker?.length, [allCoins, selectedTicker]);

	const handleConvertCoins = (data) =>
		data.map(({ base }, index) => ({
			key: `${base}${index}`,
			label: base,
			value: base,
			base,
		}));

	const loadCoins = (exchangeId, pair) => {
		TickerService.searchSymbol(exchanges.find(({ id }) => id === exchangeId)?.exchange, {
			pair,
			limit: 10000,
		})
			.then(({ results }) => {
				const convertCoins = handleConvertCoins(results);
				setAllCoins(convertCoins);
			})
			.catch((err) => console.log(err));
	};

	const handleClearAllTicker = () => {
		const values = form.getFieldsValue();
		form.setFieldsValue({ ...values, tickers: [] });
	};

	const getAllTickers = () => {
		const allValues = allCoins.reduce((acc, cur) => acc.concat(cur.value), []);
		form.setFieldValue('tickers', allValues);
		form.validateFields(['tickers']);
	};

	useEffect(() => {
		if (selectedExchangeId) loadCoins(selectedExchangeId, selectedPairWith);
	}, [selectedExchangeId, selectedPairWith]);

	const searchFixedTicker = (keyword) => {
		setTickerOptions(
			allCoins
				.filter(({ base }) => base?.toLowerCase().includes(keyword?.toLowerCase()))
				.map(({ base, label, value }) => {
					const score = stringSimilarity.compareTwoStrings(base.toLowerCase(), keyword?.toLowerCase());
					return {
						base,
						label,
						value,
						score,
					};
				})
				.sort((s1, s2) => (s1.score < s2.score ? 1 : -1))
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="card-primary flex gap-4">
				<div className="w-1/2">
					<p className="text-secondary text-4 mb-[8px]">{`${t('bot_name')} (*)`}</p>
					<Form.Item
						name="name"
						validateTrigger={['onBlur']}
						rules={[
							{ required: true, message: t('bot_name_require') },
							() => ({
								validator(_, value) {
									if (!value) {
										return Promise.resolve();
									}
									return botNameValidate(value);
								},
							}),
						]}
					>
						<Input placeholder={t('name')} data-qa="bot-name-input" />
					</Form.Item>
				</div>

				<div className="w-1/2">
					<p className="text-secondary text-4 mb-[8px]">{`${t('my_exchange')}`}</p>
					<div>
						<Form.Item name="my_exchange" rules={[{ required: true, message: t('exchange_require') }]}>
							<Select
								className="w-full"
								data-qa="bot-exchange-select"
								showSearch
								filterOption={(input, option) =>
									option.name?.toLowerCase().includes(input.toLowerCase())
								}
								options={exchanges?.map(({ id, name, exchange, mode }) => ({
									value: id,
									name,
									label: (
										<div>
											<Image
												className="w-[18px] mr-2"
												src={handleGetExchangeLogo(exchange)}
												alt=""
											/>
											<span>{name} </span>
											<Tag>{uppercaseFirstLetter(mode)}</Tag>
										</div>
									),
								}))}
								onChange={() => handleClearAllTicker()}
							/>
						</Form.Item>
					</div>
				</div>
			</div>
			<div className="card-primary">
				<p className="font-semibold text-base mb-2">{t('Config Tickers')}</p>
				<div>
					<div className="flex flex-row">
						<Tooltip title="">
							<InfoCircleOutlined className="mr-2" />{' '}
						</Tooltip>
						<p className="text-secondary text-4 mb-[8px]">{`${t('pair_with')}`}</p>
					</div>
					<Form.Item name="pair_with">
						<Select
							className="w-1/3 h-[40px]"
							data-qa="preset-pair-select"
							showSearch
							filterOption={(input, option) => option.value?.toLowerCase().includes(input.toLowerCase())}
							options={integratedExchanges
								.find(
									({ exchange, mode: modeFinded }) =>
										exchange ===
										exchanges.find(
											({ id, mode }) => id === selectedExchangeId && mode === modeFinded
										)?.exchange
								)
								?.trading_pairs.map(({ quote }) => ({
									key: quote,
									value: quote,
									label: (
										<div className="flex gap-2 items-center">
											<CoinIcon key={quote} symbol={quote.toLowerCase()} size={18} />
											<span>{quote}</span>
										</div>
									),
								}))}
							onChange={() => handleClearAllTicker()}
						/>
					</Form.Item>
					<div className="flex flex-row gap-2 mb-4">
						<Button className={`${isAllTicker ? 'hidden' : ''} `} onClick={() => getAllTickers()}>
							{t('All tickers')}
						</Button>
						<Button icon={<ClearOutlined />} onClick={() => handleClearAllTicker()}>
							{t('Clear All')}
						</Button>
					</div>
					<Form.Item
						name="tickers"
						rules={[
							{
								required: true,
								message: t('fixed_ticker_require'),
							},
						]}
						className="mb-2"
					>
						<Select
							className="w-full selectTicker"
							mode="multiple"
							placeholder={t('select_tickers')}
							filterOption={false}
							onSearch={(value) => {
								searchFixedTicker(value);
							}}
							suffixIcon={null}
							notFoundContent={null}
							options={
								tickerOptions ||
								(allCoins || []).map(({ base }) => ({
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
								}))
							}
							data-qa="ticker-select"
							popupClassName="ticker-select"
						/>
					</Form.Item>
					<span className="text-[#58667E] font-normal">Total {selectedTicker?.length || 0} tickers</span>
				</div>
			</div>
			<FixedModal
				selectedPairWith={selectedPairWith}
				exchangeInfo={exchangeInfo}
				openFixedModal={openFixedModal}
				onClose={() => setOpenFixedModal(false)}
			/>
		</div>
	);
};

export default withTranslation()(observer(StepOne));
