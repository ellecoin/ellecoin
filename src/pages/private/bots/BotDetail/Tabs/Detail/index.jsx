import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { Button, Switch, Tabs, Tooltip, Segmented, ConfigProvider, Select, Form, InputNumber, Divider } from 'antd';
import { CopyFilled, DeleteFilled, EditFilled, InfoCircleOutlined } from '@ant-design/icons';
import { useParams, useHistory, Link } from 'react-router-dom';
import React, { useMemo, useContext, useState, useEffect } from 'react';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import { TICKER_FILTER_TYPE, STRATEGY_TYPE, LEVERAGE_TYPE } from '../../helper';
import { ThemeContext } from '../../../../../../context/ThemeContext';
import DeleteOrStopBotModal from '../../../../../../components/modal/DeleteOrStopBotModal';
import BotService from '../../../../../../services/BotService';
import { getLargeNumberFormat } from '../../../../../../utils/helper';
import TimeframeSelector, { getTimeFrameLabel } from '../../../components/TimeframeSelector';
import { useLayoutContext } from '../../../../../../context/LayoutContext';
import CoinIcon from '../../../../../../components/CoinIcon';
import PlayIcon from '../../../../../../assets/icons/PlayIcon';
import { PauseIcon } from '../../../../../../assets/icons/PauseIcon';

const Detail = ({ t, botInfo, setBotInfo }) => {
	const history = useHistory();
	const { botId } = useParams();
	const { typeTheme } = useContext(ThemeContext);
	const isMobile = useMediaQuery('(max-width: 768px)');
	const [actionType, setActionType] = useState();
	const [deleteOrStopBot, setDeleteOrStopBot] = useState(false);
	const { onChangeModalConfigs } = useLayoutContext();
	const [form] = Form.useForm();
	/* 
	   1. White list
		1.1 Fixed: fixed_tickers
		1.2 Dynamic: dynamic_tickers
	   2. Black list
		2.1 Fixed: blacklist_ticker
		2.2 Dynamic: dynamic_blacklist_ticker 
	*/

	const handleUpdateBotStatus = (status) => {
		if (status === 'on') {
			onChangeModalConfigs({
				open: true,
				title: t('confirm'),
				children: t('start_bot_confirm'),
				onOk: () => {
					BotService.updateBotStatus(botId, { action: 'on' }).then(() => {
						setBotInfo({ ...botInfo, status });
					});
				},
			});
		} else {
			setActionType(status);
			setDeleteOrStopBot(true);
		}
	};

	const handleConfirmModal = (_, status) => {
		setDeleteOrStopBot(false);
		if (status === 'off') {
			setBotInfo({ ...botInfo, status });
		} else if (status === 'delete') {
			history.push('/bots');
		}
	};

	const configTickerList = useMemo(
		() => [
			{
				label: 'Fixed Config Ticker',
				value: botInfo?.fixed_tickers?.tickers,
				type: 'fixed',
				in: 'Whitelist',
			},
			{
				label: 'Fixed Config Ticker',
				value: botInfo?.blacklist_ticker?.tickers,
				type: 'fixed',
				in: 'Blacklist',
			},
		],
		[botInfo]
	);

	const renderConfigTicker = () =>
		configTickerList.map((tickerItem, idx) => {
			const { value } = tickerItem;
			if (!value) return;
			if (tickerItem.type === TICKER_FILTER_TYPE.FIXED && value) {
				return (
					<div key={idx} className="pt-2">
						<p
							className={`${
								typeTheme === 'light' ? 'text-[#282B38]' : 'text-[#FFFFFF]'
							}  text-[16px] pb-2`}
						>
							{tickerItem.in} - {tickerItem.label}
						</p>
						<ConfigProvider
							theme={{
								components: {
									Select: {
										controlHeight: 60,
									},
								},
							}}
						>
							<Select
								className="w-full selectTicker"
								mode="multiple"
								placeholder={t('select_tickers')}
								filterOption={false}
								value={value}
								suffixIcon={null}
								options={(value.map((ticker) => ({ base: ticker })) || []).map(({ base }) => ({
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
								}))}
								disabled
								data-qa="ticker-select"
								popupClassName="ticker-select"
							/>
						</ConfigProvider>
					</div>
				);
			}
			return true;
		});

	return (
		<Form
			form={form}
			initialValues={{
				take_profit_percentage: botInfo?.take_profit_percentage,
				trailing_take_profit: botInfo?.trailing_take_profit,
				stop_loss_percentage: botInfo?.stop_loss_percentage,
				use_traling_stoploss: botInfo?.use_traling_stoploss,
				trailing_stop_loss: botInfo?.trailing_stop_loss,
				use_target_total_profit: botInfo?.use_target_total_profit,
				target_total_profit: botInfo?.target_total_profit,
				use_allowed_total_loss: botInfo?.use_allowed_total_loss,
				allowed_total_loss: botInfo?.allowed_total_loss,
				use_time_cooldown: botInfo?.use_time_cooldown,
				time_cooldown: botInfo?.time_cooldown,
				use_time_close_deal: botInfo?.use_time_close_deal,
				time_close_deal: botInfo?.time_close_deal,
			}}
			className="mt-4 flex flex-col gap-4"
		>
			<div className="flex gap-1 md:gap-4 justify-start">
				{(botInfo.status === 'off' || botInfo.status === 'pause') && (
					<Button
						className={`flex items-center ${typeTheme === 'dark' ? 'bg-[#2F324180]' : 'bg-[#FFFFFF]'}`}
						onClick={() => handleUpdateBotStatus('on')}
						data-qa="edit-preset-button"
						icon={<PlayIcon />}
					>
						<span className={`block ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}>
							{botInfo.status === 'off' ? t('Start') : t('Resume')}
						</span>
					</Button>
				)}

				{botInfo.status === 'on' && (
					<Button
						className={`flex items-center ${typeTheme === 'dark' ? 'bg-[#2F324180]' : 'bg-[#FFFFFF]'} `}
						onClick={() => handleUpdateBotStatus('off')}
						icon={<PauseIcon />}
					>
						<span className={`block ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}>
							{t('stop')}
						</span>
					</Button>
				)}

				<Button
					className={`flex items-center ${typeTheme === 'dark' ? 'bg-[#2F324180]' : 'bg-[#FFFFFF]'} `}
					onClick={() => {
						history.push(`/bots/my-bot/duplicate/${botId}`);
					}}
					icon={
						<CopyFilled
							style={{
								color: `${typeTheme === 'dark' ? '#A5ADCF' : '#A5ADCF'}`,
							}}
						/>
					}
				>
					<span className={`block ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}>
						{t('Duplicate')}
					</span>
				</Button>
				<Button
					className={`flex items-center ${typeTheme === 'dark' ? 'bg-[#2F324180]' : 'bg-[#FFFFFF]'} `}
					onClick={() => history.push(`/bots/my-bot/update/${botId}`)}
					icon={
						<EditFilled
							style={{
								color: `${typeTheme === 'dark' ? '#A5ADCF' : '#A5ADCF'}`,
							}}
						/>
					}
				>
					<span className={`block ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}>
						{t('edit')}
					</span>
				</Button>
				{isMobile ? (
					<Button
						className={`flex items-center ${typeTheme === 'dark' ? 'bg-[#2F324180]' : 'bg-[#FFFFFF]'} `}
						onClick={() => handleUpdateBotStatus('delete')}
					>
						<DeleteFilled
							style={{
								color: `${typeTheme === 'dark' ? '#FA2256' : '#A5ADCF'}`,
							}}
						/>
					</Button>
				) : (
					<Button
						className={`flex items-center ${typeTheme === 'dark' ? 'bg-[#2F324180]' : 'bg-[#FFFFFF]'} `}
						onClick={() => handleUpdateBotStatus('delete')}
						icon={
							<DeleteFilled
								style={{
									color: `${typeTheme === 'dark' ? '#FA2256' : '#A5ADCF'}`,
								}}
							/>
						}
					>
						<span
							className={`hidden md:block ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('delete')}
						</span>
					</Button>
				)}
			</div>
			<div className="card-primary">
				<p className="text-primary text-[16px] font-semibold">{t('Basic information')}</p>
				<div>
					<div className="flex justify-between lg:justify-start gap-4 lg:gap-0 py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('exchange')}
						</div>
						<div className="hover:underline">
							<Link className="text-sm" to={`/exchanges/${botInfo.my_exchange?.id}`}>
								{botInfo.my_exchange?.name}
							</Link>
						</div>
					</div>
					<div className="flex justify-between lg:justify-start py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('status')}
						</div>
						<div className="text-sm">{botInfo.status?.toUpperCase()}</div>
					</div>
					<div className="flex justify-between lg:justify-start py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('pair_with')}
						</div>
						<div className="text-sm">{botInfo.pair_with}</div>
					</div>
					<div className="flex justify-between lg:justify-start py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('Investment')}
						</div>
						<div className="text-sm">{getLargeNumberFormat(botInfo.investment)} USDT</div>
					</div>
					<div className="flex justify-between lg:justify-start py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('Base order amount')}
						</div>
						<div className="text-sm">{getLargeNumberFormat(botInfo.base_order_amount)} USDT</div>
					</div>
					<div className="flex justify-between lg:justify-start py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('Time interval')}
						</div>
						<div className="text-sm">{getTimeFrameLabel(t, botInfo.time_interval)}</div>
					</div>
					<div className="flex justify-between lg:justify-start py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('Number of sample')}
						</div>
						<div className="text-sm">{botInfo.number_of_sample}</div>
					</div>
					<div className="flex justify-between lg:justify-start py-2 ">
						<div
							className={`lg:w-1/3 text-sm ${typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'}`}
						>
							{t('Change in price')}
						</div>
						<div className="text-sm">{botInfo.change_in_price}%</div>
					</div>

					{botInfo?.my_exchange?.exchange_mode === 'future' ? (
						<>
							<div className="flex justify-between items-center lg:justify-start py-0">
								<div
									className={`lg:w-1/3 text-sm ${
										typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'
									}`}
								>
									{t('Strategy')}
								</div>
								<Segmented
									rootClassName={`segmented-styled ${
										botInfo.strategy === 'SHORT' ? 'segmented-styled-short' : ''
									}`}
									value={botInfo.strategy}
									disabled
									options={STRATEGY_TYPE.map((i) => ({
										...i,
										label: <div className="text-[14px]">{t(i.label)}</div>,
									}))}
								/>
							</div>
							<div className="flex justify-between items-center lg:justify-start py-[2px] ">
								<div
									className={`lg:w-1/3 text-sm ${
										typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'
									}`}
								>
									{t('Leverage type')}
								</div>
								<Segmented
									value={botInfo.leverage_type}
									rootClassName="segmented-styled"
									disabled
									options={LEVERAGE_TYPE.map((i) => ({
										...i,
										label: <div className="text-[14px]">{t(i.label)}</div>,
									}))}
								/>
							</div>
							<div className="flex justify-between lg:justify-start py-2 ">
								<div
									className={`lg:w-1/3 text-sm ${
										typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'
									}`}
								>
									{t('Leverage value')}
								</div>
								<div className="text-sm">{botInfo.leverage}x</div>
							</div>
						</>
					) : null}

					{renderConfigTicker()}

					{botInfo.fixed_tickers?.id && (
						<div className="flex gap-2 lg:gap-0 justify-between lg:justify-start py-3 ">
							<div
								className={`lg:w-1/3 text-sm ${
									typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'
								}`}
							>
								{t('whitelist_ticker')}
							</div>
							{botInfo.fixed_tickers?.id && (
								<div className="hover:underline">
									<Link className="text-sm" to={`/presets/fixed/${botInfo.fixed_tickers?.id}`}>
										{botInfo.fixed_tickers?.name}
									</Link>
								</div>
							)}
						</div>
					)}
					{botInfo.blacklist_ticker?.id && (
						<div className="flex gap-2 lg:gap-0 justify-between lg:justify-start py-3 ">
							<div
								className={`lg:w-1/3 text-sm ${
									typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'
								}`}
							>
								{t('blacklist_ticker')}
							</div>
							{botInfo.blacklist_ticker?.id && (
								<div className="hover:underline">
									<Link to={`/presets/fixed/${botInfo.blacklist_ticker?.id}`}>
										{botInfo.blacklist_ticker?.name}
									</Link>
								</div>
							)}
						</div>
					)}
					{botInfo.indicator_preset?.id && (
						<div className="flex justify-between lg:justify-start py-3 ">
							<div
								className={`lg:w-1/3 text-sm ${
									typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'
								}`}
							>
								{' '}
								{t('pause_indicator')}
							</div>
							<div>{botInfo.indicator_preset?.name}</div>
						</div>
					)}
				</div>
			</div>

			{/* Take Profit */}
			<div className="card-primary mb-4 gap-4">
				<p className="font-semibold text-base mb-2">{t('Take Profit')}</p>
				<div className="mt-[24px]">
					<Tabs defaultActiveKey="1">
						<Tabs.TabPane tab={`${t('Percentage')} *`} key="1">
							<div className="flex flex-row gap-4">
								<div className="flex flex-col gap-2 w-1/2">
									<div className="flex items-center gap-2">
										<Tooltip title={t('take_profit_note')}>
											<InfoCircleOutlined style={{ fontSize: 18 }} />
										</Tooltip>
										<span className="text-primary text-[14px]">{t('Take profit')}</span>
									</div>
									<Form.Item className="w-full" name="take_profit_percentage">
										<InputNumber
											rootClassName="w-full"
											data-qa="bot-take-profit-input"
											addonAfter="%"
											min={0}
											disabled
										/>
									</Form.Item>
								</div>
								<div className="flex flex-col w-1/2 gap-2">
									<div className="flex items-center gap-2 h-[21px]">
										<Tooltip
											color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'}
											title={t('trailing_profit_help')}
										>
											<InfoCircleOutlined style={{ fontSize: 18 }} />
										</Tooltip>
										<span className="text-primary text-[14px]">{t('Trailing Profit')}</span>
										<Form.Item className="mb-0" name="use_traling_stoploss" valuePropName="checked">
											<Switch className="ml-4" disabled />
										</Form.Item>
									</div>
									<div>
										<Form.Item className="w-full" name="trailing_take_profit">
											<InputNumber
												rootClassName="w-full"
												data-qa="trailing-take-profit-input"
												disabled
											/>
										</Form.Item>
									</div>
								</div>
							</div>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>

			{/* Stop loss */}
			<div className="card-primary mb-4 gap-4">
				<p className="text-primary text-[16px] font-semibold">{t('Stop loss')}</p>
				<Divider className="my-2" />
				<div className="flex flex-row gap-4">
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip title={t('stop_loss_note')}>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Stop loss')}</span>
						</div>
						<div className="">
							<Form.Item className="w-full" name="stop_loss_percentage">
								<InputNumber
									rootClassName="w-full"
									data-qa="bot-take-profit-input"
									addonAfter="%"
									min={0}
									disabled
								/>
							</Form.Item>
						</div>
					</div>
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2 h-[21px]">
							<Tooltip
								color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'}
								title={t('trailing_stoploss_help')}
							>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Trailing Stoploss')}</span>
							<Form.Item className="mb-0" name="use_traling_stoploss" valuePropName="checked">
								<Switch className="ml-4" disabled />
							</Form.Item>
						</div>
						<div>
							<Form.Item className="w-full" name="trailing_stop_loss">
								<InputNumber rootClassName="w-full" data-qa="trailing-stoploss-input" disabled />
							</Form.Item>
						</div>
					</div>
				</div>
			</div>

			<div className="card-primary mb-4 gap-4">
				<p className="text-primary text-[16px] font-semibold">{t('Risk management')}</p>
				<Divider className="my-2" />
				<div className="flex flex-row gap-4">
					<div className="flex flex-col gap-2 w-1/2">
						<div className="flex items-center gap-2">
							<Tooltip
								title={t(
									"Set the target profit percentage of the bot's investment at which the bot will close"
								)}
							>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Target total profit')}</span>
							<Form.Item className="mb-0" name="use_target_total_profit" valuePropName="checked">
								<Switch disabled className="ml-4" />
							</Form.Item>
						</div>

						{botInfo?.use_target_total_profit && (
							<div className="w-full">
								<Form.Item name="target_total_profit">
									<InputNumber disabled rootClassName="w-full" addonAfter="%" min={0} />
								</Form.Item>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-2 w-1/2">
						<div className="flex items-center gap-2">
							<Tooltip
								title={t(
									"The maximum loss percentage of the bot's investment at which the bot will close"
								)}
							>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Allowed total loss')}</span>
							<Form.Item className="mb-0" name="use_allowed_total_loss" valuePropName="checked">
								<Switch disabled className="ml-4" />
							</Form.Item>
						</div>

						{botInfo?.use_allowed_total_loss && (
							<div className="w-full">
								<Form.Item className="" name="allowed_total_loss">
									<InputNumber disabled rootClassName="w-full" addonAfter="%" min={0} />
								</Form.Item>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="card-primary mb-4 gap-4">
				<p className="text-primary text-[16px] font-semibold">{t('Advanced settings')}</p>
				<Divider className="my-2" />
				<div className="flex flex-row gap-4">
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip
								title={t(
									'This is the time in seconds that the bot will wait after a deal is closed before it will accept a signal to start a new deal for the same asset pair. The bot will use a different timer for each asset pair the bot is allowed to trade.'
								)}
							>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Cooldown between deals')}</span>
							<Form.Item className="mb-0" name="use_time_cooldown" valuePropName="checked">
								<Switch disabled className="ml-4" />
							</Form.Item>
						</div>

						{botInfo?.use_time_cooldown && (
							<Form.Item className="w-full" name="time_cooldown">
								<TimeframeSelector disabled className="w-full" />
							</Form.Item>
						)}
					</div>
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip title={t('The time after which, deal will be closed automatically')}>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Close deal after timeout')}</span>
							<Form.Item className="mb-0" name="use_time_close_deal" valuePropName="checked">
								<Switch className="ml-4" disabled />
							</Form.Item>
						</div>

						{botInfo?.use_time_close_deal && (
							<Form.Item className="w-full" name="time_close_deal" help={errors.time_close_deal}>
								<TimeframeSelector disabled className="w-full" />
							</Form.Item>
						)}
					</div>
				</div>
			</div>

			<DeleteOrStopBotModal
				data={botInfo}
				action={actionType}
				botId={botId}
				open={deleteOrStopBot}
				onClose={(botId, status) => {
					handleConfirmModal(botId, status);
				}}
			/>
		</Form>
	);
};

export default observer(withTranslation()(Detail));
