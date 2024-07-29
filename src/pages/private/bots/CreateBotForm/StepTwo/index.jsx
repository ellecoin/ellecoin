import React, { useEffect, useRef, useState, useContext } from 'react';
import { InputNumber, Form, Tabs, Switch, Tooltip, ConfigProvider, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';

import TimeframeSelector from '../../components/TimeframeSelector';
import { themeObject } from '../../../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../../../context/ThemeContext';

const StepTwo = ({ t, disableValidate = false, editMode = false, errors, status = 'off' }) => {
	const form = Form.useFormInstance();
	const use_traling_stoploss = Form.useWatch('use_traling_stoploss', form);
	const use_target_total_profit = Form.useWatch('use_target_total_profit', form);
	const use_allowed_total_loss = Form.useWatch('use_allowed_total_loss', form);
	const use_time_cooldown = Form.useWatch('use_time_cooldown', form);
	const use_time_close_deal = Form.useWatch('use_time_close_deal', form);
	const pair_with = Form.useWatch('pair_with', form);
	const { typeTheme } = useContext(ThemeContext);
	const strategyWatch = Form.useWatch('strategy', form);

	const themeConfig = {
		components: {
			Input: {
				controlHeight: 36,
			},
			InputNumber: {
				controlHeight: 36,
			},
			Select: {
				controlHeight: 36,
				colorSplit: themeObject[typeTheme].borderColor,
			},
			Segmented: {
				itemSelectedBg: strategyWatch === 'LONG' ? '#30E0A1' : '#FA2256',
			},
			Slider: {
				dotActiveBorderColor: '#30E0A1',
				handleActiveColor: '#30E0A1',
				handleColor: '#30E0A1',
				trackBg: '#30E0A1',
				trackHoverBg: '#30E0A1',
			},
		},
	};

	return (
		<ConfigProvider theme={themeConfig}>
			<div className="card-primary mb-4 gap-4">
				<p className="font-semibold text-base mb-2">{t('Invesment')}</p>
				<Divider className="my-2" />
				<div className="flex flex-row gap-4">
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip title={t('Total amount will be used for tradings')}>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Investment')}</span>
						</div>
						<Form.Item
							className="w-full"
							name="investment"
							rules={[
								({ getFieldValue }) => ({
									validator(_, value) {
										if (disableValidate) {
											return Promise.resolve();
										}
										if (value < getFieldValue('base_order_amount') || !value) {
											return Promise.reject(
												t('Investment amount must greater than or equal to base order amount')
											);
										}
										return Promise.resolve();
									},
								}),
							]}
						>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								className="w-full"
								data-qa="bot-quantity-input"
								addonAfter={pair_with === 'BRL' ? 'BRL' : 'USDT'}
								disabled={editMode}
							/>
						</Form.Item>
					</div>
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip
								title={t(
									'The Base Order is the first order the bot will create when starting a new deal.'
								)}
							>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Base order amount')}</span>
						</div>
						<div className="w-full">
							<Form.Item
								name="base_order_amount"
								rules={[
									({ getFieldValue }) => ({
										validator(_, value) {
											if (disableValidate) {
												return Promise.resolve();
											}
											if (value > getFieldValue('investment')) {
												return Promise.reject(
													t(
														'Base order amount must be less than or equal to total investment amount'
													)
												);
											}
											if (value < 15) {
												return Promise.reject(
													t(
														'Base order amount must be greater than or equal to {{amount}}.',
														{
															amount: 15,
														}
													)
												);
											}
											return Promise.resolve();
										},
									}),
								]}
							>
								<InputNumber
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									className="w-full"
									min={1}
									addonAfter={pair_with === 'BRL' ? 'BRL' : 'USDT'}
									disabled={editMode}
								/>
							</Form.Item>
						</div>
					</div>
				</div>
			</div>

			{/* Stragetegy */}
			<div className="card-primary mb-4 gap-4">
				<p className="font-semibold text-base mb-2">{t('Strategy')}</p>
				<Divider className="my-2" />
				<div className="flex flex-row gap-4">
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip title={t('The Time interval is the timeframe that the bot will check the price')}>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Time interval')}</span>
						</div>
						<div>
							<Form.Item
								className="w-full"
								name="time_interval"
								rules={[
									{
										required: !disableValidate,
										message: t('time_frame_require'),
									},
									{
										warningOnly: disableValidate,
										type: 'number',
										min: 1,
										message: t('time_frame_require'),
									},
								]}
							>
								<TimeframeSelector className="w-full" disabled={editMode && status === 'on'} />
							</Form.Item>
						</div>
					</div>
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip title={t('Number of candles which will be use to check the price volatility')}>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Number of sample')}</span>
						</div>
						<div>
							<Tooltip title={editMode && status === 'on' && t('Please stop your bot before editing')}>
								<Form.Item
									className="w-full "
									name="number_of_sample"
									rules={[
										{
											required: !disableValidate,
											message: t('sample_require'),
										},
										{
											warningOnly: disableValidate,
											type: 'number',
											min: 1,
											message: t('sample_require'),
										},
									]}
								>
									<InputNumber
										rootClassName="w-full"
										min={1}
										disabled={editMode && status === 'on'}
										data-qa="bot-sample"
										value
									/>
								</Form.Item>
							</Tooltip>
						</div>
					</div>
				</div>
				<div className="flex flex-row gap-4">
					<div className="flex flex-col w-1/2 gap-2">
						<div className="flex items-center gap-2">
							<Tooltip title={t('change_in_price_note')}>
								<InfoCircleOutlined style={{ fontSize: 18 }} />
							</Tooltip>
							<span className="text-primary text-[14px]">{t('Change in price')}</span>
						</div>
						<div className="">
							<Tooltip title={editMode && status === 'on' && t('Please stop your bot before editing')}>
								<Form.Item
									className="w-full"
									name="change_in_price"
									rules={[
										() => ({
											validator(_, value) {
												if (disableValidate || value > 0) {
													return Promise.resolve();
												}
												return Promise.reject(t('change_in_price_require'));
											},
										}),
									]}
								>
									<InputNumber
										className="w-full"
										min={0}
										addonAfter="%"
										disabled={editMode && status === 'on'}
									/>
								</Form.Item>
							</Tooltip>
						</div>
					</div>
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
									<Form.Item
										className="w-full"
										name="take_profit_percentage"
										rules={[
											() => ({
												validator(_, value) {
													if (disableValidate || value > 0) {
														return Promise.resolve();
													}
													return Promise.reject(t('take_profit_require'));
												},
											}),
										]}
									>
										<InputNumber
											rootClassName="w-full"
											data-qa="bot-take-profit-input"
											addonAfter="%"
											min={0}
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
											<Switch className="ml-4" />
										</Form.Item>
									</div>
									<div>
										<Form.Item
											className="w-full"
											name="trailing_take_profit"
											rules={[
												() => ({
													validator(_, value) {
														if (value > 0) {
															return Promise.resolve();
														}
														return Promise.reject(
															t('Trailing Profit must be greater than {{count}}', {
																count: 0,
															})
														);
													},
												}),
											]}
										>
											<InputNumber
												rootClassName="w-full"
												data-qa="trailing-take-profit-input"
												disabled={!use_traling_stoploss}
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
							<Form.Item
								className="w-full"
								name="stop_loss_percentage"
								rules={[
									() => ({
										validator(_, value) {
											if (disableValidate || value > 0) {
												return Promise.resolve();
											}
											return Promise.reject(t('stop_loss_require'));
										},
									}),
								]}
							>
								<InputNumber
									rootClassName="w-full"
									data-qa="bot-take-profit-input"
									addonAfter="%"
									min={0}
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
								<Switch className="ml-4" />
							</Form.Item>
						</div>
						<div>
							<Form.Item
								className="w-full"
								name="trailing_stop_loss"
								rules={[
									() => ({
										validator(_, value) {
											if (value > 0) {
												return Promise.resolve();
											}
											return Promise.reject(
												t('Trailing Stoploss must be greater than {{count}}', {
													count: 0,
												})
											);
										},
									}),
								]}
							>
								<InputNumber
									rootClassName="w-full"
									data-qa="trailing-stoploss-input"
									disabled={!use_traling_stoploss}
								/>
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
								<Switch className="ml-4" />
							</Form.Item>
						</div>

						{use_target_total_profit && (
							<div className="w-full">
								<Form.Item
									name="target_total_profit"
									rules={[
										() => ({
											validator(_, value) {
												if (value > 0) {
													return Promise.resolve();
												}
												return Promise.reject(t('Target total profit must be greater than 0'));
											},
										}),
									]}
								>
									<InputNumber rootClassName="w-full" addonAfter="%" min={0} />
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
								<Switch className="ml-4" />
							</Form.Item>
						</div>

						{use_allowed_total_loss && (
							<div className="w-full">
								<Form.Item
									className=""
									name="allowed_total_loss"
									rules={[
										() => ({
											validator(_, value) {
												if (value > 0) {
													return Promise.resolve();
												}
												return Promise.reject(t('Allowed total loss must be greater than 0'));
											},
										}),
									]}
								>
									<InputNumber rootClassName="w-full" addonAfter="%" min={0} />
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
								<Switch className="ml-4" />
							</Form.Item>
						</div>

						{use_time_cooldown && (
							<Form.Item
								className="w-full"
								name="time_cooldown"
								rules={[
									{
										required: !disableValidate,
										message: t('Target total profit must be greater than 0'),
									},
									{
										warningOnly: disableValidate,
										type: 'number',
										min: 1,
										message: t('Target total profit must be greater than 0'),
									},
								]}
								validateStatus={errors.time_cooldown ? 'error' : undefined}
								help={errors.time_cooldown}
							>
								<TimeframeSelector className="w-full" />
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
								<Switch className="ml-4" />
							</Form.Item>
						</div>

						{use_time_close_deal && (
							<Form.Item
								className="w-full"
								name="time_close_deal"
								rules={[
									{
										required: !disableValidate,
										message: t('Target total profit must be greater than 0'),
									},
									{
										warningOnly: disableValidate,
										type: 'number',
										min: 1,
										message: t('Target total profit must be greater than 0'),
									},
								]}
								validateStatus={errors.time_close_deal ? 'error' : undefined}
								help={errors.time_close_deal}
							>
								<TimeframeSelector className="w-full" />
							</Form.Item>
						)}
					</div>
				</div>
			</div>
		</ConfigProvider>
	);
};

export default withTranslation()(StepTwo);
