import { Button } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';

const BotItemTableView = ({ t, className, bot, onUpdateStatus, onDelete, ...props }) => (
	<tr className={className} role="row" {...props} data-qa="bot-item">
		<td data-qa="bot-name">{bot.name}</td>
		<td data-qa="bot-mode">
			<span className={`${bot.test_mode ? 'text-[green] ' : 'text-[red]'} text-[20px]`}>
				<i className="fa fas fa-check-circle" />
			</span>
		</td>
		<td data-qa="bot-status">
			<span className="text-[black] uppercase">{bot.status}</span>
		</td>
		<td data-qa="bot-profit">
			<span
				className={`text-lg ${
					parseFloat(bot.profit) > 0 ? 'text-[green]' : parseFloat(bot.profit) < 0 ? 'text-[red]' : ''
				}`}
			>
				{`${bot.profit}%`}
			</span>
		</td>
		{/* <td> */}
		{/* <div className="w-[150px] h-[40px]"> */}
		{/* /!* <PortfolioChart /> *!/ */}
		{/* <BotPerformanceChart botId={bot.id} /> */}
		{/* </div> */}
		{/* </td> */}
		<td className="pr-2 w-[180px]">
			{bot.status === 'on' ? (
				<Button
					size="small"
					type="primary"
					className="px-2 py-1"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onUpdateStatus?.(bot.id, 'off');
					}}
					data-qa="bot-stop-button"
				>
					{t('stop')}
				</Button>
			) : (
				<Button
					size="small"
					type="primary"
					className="px-2 py-1"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						onUpdateStatus?.(bot.id, 'on');
					}}
					data-qa="bot-start-button"
				>
					{t('run')}
				</Button>
			)}
			<Button
				type="primary"
				danger
				size="small"
				className="px-2 py-1 ml-2"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onDelete?.(bot.id);
				}}
				data-qa="bot-delete-button"
			>
				{t('delete')}
			</Button>
		</td>
	</tr>
);

export default withTranslation()(BotItemTableView);
