import React from 'react';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'antd';
import { useStore } from '../../../../context/AppContext';

const BotItemCardView = ({ t, className, bot, onUpdateStatus, onDelete, ...props }) => {
	const { stateStore } = useStore();

	return (
		<div className={`${className} rounded-md shadow-md p-4`} {...props} data-qa="bot-item">
			<div className="flex justify-between gap-8 mb-2">
				<div>{t('name')}</div>
				<div className="font-semibold text-right break-word" data-qa="bot-name">
					{bot.name}
				</div>
			</div>
			{/* <div className="flex justify-between mb-2">
				<div>{t('test_mode')}</div>
				<div data-qa="bot-mode">
					<span className={`${bot.test_mode ? 'text-[green] ' : 'text-[red]'} text-[20px]`}>
						<i className="fa fas fa-check-circle" />
					</span>
				</div>
			</div> */}
			<div className="flex justify-between mb-2">
				<div>{t('status')}</div>
				<div
					className={`uppercase ${
						bot.status === 'on' ? 'text-[green]' : bot.status === 'off' ? 'text-[red]' : 'text-[black]'
					}`}
					data-qa="bot-status"
				>
					{bot.status}
				</div>
			</div>
			<div className="flex justify-between mb-2">
				<div>{`${t('session_profit')}`}</div>
				<div className="col-span-3" data-qa="bot-profit">
					<span className="text-base">
						{stateStore.getCurrency(parseFloat(bot.est) || 0, bot.my_exchange?.exchange_code)}
					</span>{' '}
					<span
						className={
							parseFloat(bot.profit) > 0 ? 'text-[green]' : parseFloat(bot.profit) < 0 ? 'text-[red]' : ''
						}
					>
						({parseFloat(bot.profit)}%)
					</span>
				</div>
			</div>
			<div className="flex justify-between mb-2">
				<div>{`${t('daily_profit')}`}</div>
				<div className="col-span-3" data-qa="bot-profit">
					<span className="text-base">
						{stateStore.getCurrency(parseFloat(bot.daily_pnl_est) || 0, bot.my_exchange?.exchange_code)}
					</span>{' '}
					<span
						className={
							parseFloat(bot.daily_pnl_percent) > 0
								? 'text-[green]'
								: parseFloat(bot.daily_pnl_percent) < 0
								? 'text-[red]'
								: ''
						}
					>
						({parseFloat(bot.daily_pnl_percent)}%)
					</span>
				</div>
			</div>
			{/* <div className="grid grid-cols-5 gap-x-4 mb-2 items-center"> */}
			{/* <div className="col-span-2">{t('portfolio')}</div> */}
			{/* <div className="col-span-3"> */}
			{/* <div className="w-[150px] h-[40px]"> */}
			{/* <PortfolioChart /> */}
			{/* </div> */}
			{/* </div> */}
			{/* </div> */}

			<div className="flex items-center justify-start">
				{bot.status === 'on' && (
					<button
						className=" border p-2 inline-flex items-center justify-center border-r-0 rounded-l"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onUpdateStatus(bot.id, 'off');
						}}
						data-qa="edit-preset-button"
					>
						<Tooltip color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'} title={t('stop')}>
							<i className="fa fa-solid fa-pause" />
						</Tooltip>
					</button>
				)}
				{bot.status === 'off' && (
					<button
						className=" border p-2 inline-flex items-center justify-center border-r-0 rounded-l"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onUpdateStatus(bot.id, 'on');
						}}
						data-qa="edit-preset-button"
					>
						<Tooltip color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'} title={t('run')}>
							<i className="fa fa-solid fa-play text-[green]" />
						</Tooltip>
					</button>
				)}
				{bot.status === 'pause' && (
					<button
						className=" border p-2 inline-flex items-center justify-center border-r-0 rounded-l"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onUpdateStatus(bot.id, 'on');
						}}
						data-qa="edit-preset-button"
					>
						<Tooltip color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'} title={t('Resume')}>
							<i className="fa fa-solid fa-play text-[#fbbf24]" />
						</Tooltip>
					</button>
				)}
				<button
					className=" border p-2 inline-flex items-center justify-center rounded-r"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onDelete?.(bot.id);
					}}
					data-qa="delete-preset-button"
				>
					<Tooltip color={typeTheme === 'dark' ? '#1E1F25' : '#FFFFFF'} title={t('delete')}>
						<i className="fa fa-solid fa-trash text-[red]" />
					</Tooltip>
				</button>
			</div>

			{/* <div> */}
			{/*	{bot.status === 'on' ? ( */}
			{/*		<Button */}
			{/*			className="py-2 px-4" */}
			{/*			onClick={(e) => { */}
			{/*				e.preventDefault(); */}
			{/*				e.stopPropagation(); */}
			{/*				onUpdateStatus(bot.id, 'off'); */}
			{/*			}} */}
			{/*			data-qa="bot-stop-button" */}
			{/*		> */}
			{/*			{t('stop')} */}
			{/*		</Button> */}
			{/*	) : ( */}
			{/*		<Button */}
			{/*			className="py-2 px-4" */}
			{/*			onClick={(e) => { */}
			{/*				e.preventDefault(); */}
			{/*				e.stopPropagation(); */}
			{/*				onUpdateStatus(bot.id, 'on'); */}
			{/*			}} */}
			{/*			data-qa="bot-start-button" */}
			{/*		> */}
			{/*			{t('run')} */}
			{/*		</Button> */}
			{/*	)} */}
			{/*	<Button */}
			{/*		className="py-2 px-4 ml-2" */}
			{/*		variant="danger" */}
			{/*		onClick={(e) => { */}
			{/*			e.preventDefault(); */}
			{/*			e.stopPropagation(); */}
			{/*			onDelete?.(bot.id); */}
			{/*		}} */}
			{/*		data-qa="bot-delete-button" */}
			{/*	> */}
			{/*		{t('delete')} */}
			{/*	</Button> */}
			{/* </div> */}
		</div>
	);
};

export default withTranslation()(BotItemCardView);
