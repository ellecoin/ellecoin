import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Flex, Dropdown, Checkbox } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import Image from '../../../../../components/Image';
import { handleGetExchangeLogo } from '../../../../../utils/helper';
import { PATHS } from '../../../../../constants/routes';
import { Link as LibLink, Text } from '../../../../../components';
import { BotStatusLabel, ExchangeButton } from '../BotList.styles';
import { capitalizeFirstLetter } from '../../../../../utils/string';
import { useStore } from '../../../../../context/AppContext';
import { matchBotStatusLabel } from '../../helper';
import { BOT_ACTIONS, BOT_STATUS_LIST } from '../../../../../constants/bot';
import { ViewDetailIcon } from '../../../../../assets/icons/ViewDetail';
import { DuplicateIcon } from '../../../../../assets/icons/DuplicateIcon';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { StartIcon } from '../../../../../assets/icons/StartIcon';
import { PauseIcon } from '../../../../../assets/icons/PauseIcon';
import { StopIcon } from '../../../../../assets/icons/StopIcon';
import DeleteIcon from '../../../../../assets/icons/my-exchange/DeleteIcon';

const CardItem = ({ onChangeSelectedBots, dataItem, selectedBots, isSelectAllBots, onClickActionBot, t }) => {
	const {
		id,
		name,
		my_exchange,
		profit,
		est,
		daily_pnl_percent,
		daily_pnl_est,
		created,
		status,
		est_no_holdings,
		profit_no_holdings,
	} = dataItem;
	const { stateStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);

	const renderName = () => (
		<div className="flex items-center">
			<Image className="w-[18px] mr-2" src={handleGetExchangeLogo(my_exchange?.exchange_code)} alt="" />
			<span className="text-primary text-[14px]">{name}</span>
		</div>
	);

	const renderExchange = () => (
		<div className="flex flex-row items-center gap-1">
			<LibLink to={`${PATHS.exchange}/${my_exchange?.id}`}>{my_exchange?.name}</LibLink>
			{/* <ExchangeButton className="min-w-[70px] h-[21px]"> */}
			{/*	{capitalizeFirstLetter(my_exchange?.exchange_mode)} */}
			{/* </ExchangeButton> */}
		</div>
	);

	const renderSessionPNL = () => (
		<div className="text-table-body text-[12px]">
			<span
				className={`font-semibold ${
					parseFloat(profit) > 0
						? 'text-[#11CABE]'
						: parseFloat(profit) < 0
						? 'text-red-01'
						: 'text-secondary'
				}`}
			>
				{`${profit}%`}
			</span>{' '}
			<span>{stateStore.getCurrency(parseFloat(est) || 0, my_exchange?.exchange_code)}</span>
		</div>
	);

	const renderDailyPNL = () => (
		<div className="text-table-body text-[12px]">
			<span
				className={`font-semibold ${
					parseFloat(daily_pnl_percent) > 0
						? 'text-[#11CABE]'
						: parseFloat(daily_pnl_percent) < 0
						? 'text-red-01'
						: 'text-secondary'
				}`}
			>
				{`${daily_pnl_percent}%`}
			</span>{' '}
			<span>{stateStore.getCurrency(daily_pnl_est, my_exchange?.exchange_code)}</span>
		</div>
	);

	const renderDateTimeTable = (timestamp) => {
		const dateFormat = dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
		return <span className="text-primary text-[12px]"> {dateFormat} </span>;
	};

	const renderCreatedTime = () => renderDateTimeTable(created);

	const actions = [
		{
			value: BOT_ACTIONS.detail,
			label: t('detail'),
			forDetail: true,
			icon: <ViewDetailIcon />,
		},
		{
			value: BOT_ACTIONS.duplicate,
			label: t('Duplicate'),
			forDetail: true,
			icon: <DuplicateIcon />,
		},
		{
			value: BOT_ACTIONS.start,
			label: t('start_bot'),
			icon: <StartIcon />,
		},
		{ value: BOT_ACTIONS.pause, label: t('pause'), icon: <PauseIcon /> },
		{ value: BOT_ACTIONS.stop, label: t('stop'), icon: <StopIcon /> },
		{ value: BOT_ACTIONS.delete, label: t('delete'), icon: <DeleteIcon /> },
	];

	const renderActions = () => {
		const labelConfigs = matchBotStatusLabel(status);
		let filtedActions = actions
			.filter((action) => !action.forList)
			.map(({ value, label, icon }) => {
				if (status === BOT_STATUS_LIST.on && value === BOT_ACTIONS.start) return;
				if (status === BOT_STATUS_LIST.deleting && value === BOT_ACTIONS.delete) return;
				if (BOT_STATUS_LIST.off === status && [BOT_ACTIONS.pause, BOT_ACTIONS.stop].indexOf(value) > -1) return;
				if (BOT_STATUS_LIST.pause === status && value === BOT_ACTIONS.pause) return;

				const data = {
					id,
					est,
					profit,
					est_no_holdings,
					profit_no_holdings,
					my_exchange,
					status,
				};
				return {
					label: (
						<Flex key={value} className="gap-2 items-center" onClick={() => onClickActionBot(value, data)}>
							{icon}
							<Text>{label}</Text>
						</Flex>
					),
					key: value,
				};
			})
			.filter((action) => action);

		filtedActions = filtedActions.flatMap((action, idx) =>
			idx < filtedActions.length - 1
				? [
						action,
						{
							type: 'divider',
							dashed: true,
							style: {
								backgroundColor: `${typeTheme === 'light' ? '#6D5CDA24' : '#31314A'}`,
							},
						},
				  ]
				: [action]
		);
		return (
			<div className="flex items-center space-x-2">
				<BotStatusLabel style={{ backgroundColor: labelConfigs.bgColor }}>
					{t(labelConfigs.label)}
				</BotStatusLabel>

				<Dropdown
					menu={{
						items: filtedActions,
					}}
					overlayStyle={{ minWidth: 164 }}
					trigger={['click']}
				>
					<MoreOutlined />
				</Dropdown>
			</div>
		);
	};

	const infoItem = [
		{ label: 'name', itemRender: renderName(), id: 'name' },
		{ label: 'exchange', itemRender: renderExchange(), id: 'exchange' },
		{
			label: 'session_profit',
			itemRender: renderSessionPNL(),
			id: 'sessionPNL',
		},
		{ label: 'daily_profit', itemRender: renderDailyPNL(), id: 'dailyPNL' },
		{ label: 'created', itemRender: renderCreatedTime(), id: 'createdTime' },
		{ label: 'actions', itemRender: renderActions(), id: 'actions' },
	];

	return (
		<div key={id} className="card-primary rounded-[8px] gap-4 mb-4 flex flex-col text-[14px]">
			<Checkbox
				onChange={() => onChangeSelectedBots(id)}
				checked={selectedBots.includes(id) || isSelectAllBots}
			/>
			{(infoItem || []).map((i) => (
				<div className="flex flex-row items-center justify-between" key={i.id}>
					<p>{t(i.label)}</p>
					{i.itemRender}
				</div>
			))}
		</div>
	);
};

export default withTranslation()(CardItem);
