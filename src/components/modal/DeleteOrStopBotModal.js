import { Button, Checkbox, ConfigProvider, Divider, Modal, Typography } from 'antd';
import { withTranslation } from 'react-i18next';
import React, { useContext, useMemo, useState } from 'react';
import { useStore } from '../../context/AppContext';
import { themeObject } from '../../styles/themes/themeVariables';
import { ThemeContext } from '../../context/ThemeContext';
import botService from '../../services/BotService';
import InfoModalIcon from '../../assets/icons/InfoModalIcon';
import { BOT_STATUS_LIST } from '../../constants/bot';
import { toastify } from '../Toastify';

const DeleteOrStopBotModal = ({ t, botId, data, action, open, onClose, setActionType, reloadBotList }) => {
	const [loading, setLoading] = useState(false);
	const { typeTheme } = useContext(ThemeContext);
	const [sellAll, setSellAll] = useState(true);
	const { stateStore } = useStore();

	const themeConfig = {
		components: {
			token: {
				colorBgLayout: themeObject[typeTheme].background,
			},
			Input: {
				controlHeight: 40,
				fontSize: 16,
				colorBorder: themeObject[typeTheme].borderColor,
				borderRadius: 8,
			},
			Button: {
				borderRadius: 8,
			},
		},
	};

	const onChangeCheckbox = (value) => {
		setSellAll(value);
	};
	const handleSubmit = (values) => {
		if (isDeletePopup && botIsRunning) {
			setActionType('off');
			return;
		}
		setLoading(true);
		botService
			.updateBotStatus(botId, {
				action,
				have_sell_all_coins: botIsRunning ? false : sellAll,
			})
			.then((res) => {
				onClose?.(botId, action);

				if (action === 'delete') {
					toastify.success(res.message || t('delete_bot_success'));
				}
				reloadBotList?.();
			})
			.catch(({ errors }) => {
				if (action === 'delete') {
					Modal.error({
						content: t('delete_bot_fail'),
						okText: t('close'),
					});
				} else {
					Modal.error({
						content: t('update_bot_error'),
						okText: t('close'),
					});
				}
			})
			.finally(() => setLoading(false));
	};

	const botIsRunning = useMemo(() => data?.status === BOT_STATUS_LIST.on, [data?.status]);
	const isDeletePopup = useMemo(() => action === 'delete', [action]);

	return (
		<ConfigProvider theme={themeConfig}>
			<Modal
				title={
					<span className="flex items-center gap-3">
						<InfoModalIcon color={action === 'delete' && !botIsRunning ? '#FA2256' : '#FFC107'} />
						{action === 'delete'
							? botIsRunning
								? t('confirm_stop_bot')
								: t('delete_confirm')
							: t('stop_bot_confirm')}
					</span>
				}
				open={open}
				footer={null}
				onCancel={() => {
					setSellAll(true);
					onClose?.();
				}}
			>
				<Divider className="my-4" />
				{!isDeletePopup && (
					<>
						<div>
							<Checkbox
								checked={!sellAll}
								className="font-medium"
								onChange={() => onChangeCheckbox(false)}
							>
								<span className="text-[14px]">{t('Delete all orders and keep the coins')}</span>
								<br />
								<span className="text-[12px] text-secondary">{t('delete_all_modal_description')}</span>
								<div className="mt-2 text-[12px] text-secondary">
									{t('Bot profit')} :{' '}
									{stateStore.getCurrency(
										parseFloat(data.est_no_holdings) || 0,
										data.my_exchange?.exchange_code
									)}
									/{' '}
									<span
										className={
											data.profit_no_holdings > 0
												? 'text-green-02'
												: data.profit_no_holdings < 0
												? 'text-red-01'
												: ''
										}
									>
										{data.profit_no_holdings}%
									</span>
								</div>
							</Checkbox>
							<Divider />
							<Checkbox checked={sellAll} className="font-medium" onChange={() => onChangeCheckbox(true)}>
								<span className="text-[14px]">{t('Sell all orders at market price')}</span>
								<br />
								<span className="text-[12px] text-secondary">{t('sell_all_modal_description')}</span>
								<div className="mt-2 text-[12px] text-secondary">
									{t('Bot profit')} :{' '}
									{stateStore.getCurrency(parseFloat(data.est) || 0, data.my_exchange?.exchange_code)}
									/{' '}
									<span
										className={
											data.profit > 0 ? 'text-green-02' : data.profit < 0 ? 'text-red-01' : ''
										}
									>
										{data.profit}%
									</span>
								</div>
							</Checkbox>
						</div>
						<Divider />
					</>
				)}

				{action === 'delete' && (
					<Typography className="pb-4 font-[16px]">
						{botIsRunning ? t('need_stop_bot_before_delete') : t('delete_bot_confirm')}
					</Typography>
				)}

				<div className="text-right flex justify-end gap-2">
					<Button className="button-primary-outline--default" onClick={() => onClose?.()}>
						{t('no')}
					</Button>
					<Button
						type="primary"
						htmlType="submit"
						loading={loading}
						className="button-primary"
						onClick={handleSubmit}
					>
						{t('yes')}
					</Button>
				</div>
			</Modal>
		</ConfigProvider>
	);
};

export default withTranslation()(DeleteOrStopBotModal);
