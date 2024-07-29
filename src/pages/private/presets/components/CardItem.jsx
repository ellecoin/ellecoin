import React from 'react';
import { Button, Tag } from 'antd';
import { withTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getExchangeName } from '../../../../utils/helper';
import { uppercaseFirstLetter } from '../../../../utils/utils';
import DeleteIcon from '../../../../assets/icons/my-exchange/DeleteIcon';
import PenIcon from '../../../../assets/icons/my-exchange/PenIcon';

const CardItem = ({ t, data, handleDeleteFixedPreset, typeTheme }) => {
	const { id, name, type, pair, created, exchangeMode, exchange_code } = data;
	const history = useHistory();

	const renderDateTimeTable = (timestamp) => {
		const dateFormat = dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
		return <span className="text-primary text-[14px]"> {dateFormat} </span>;
	};

	const renderName = () => <span className="text-table-body">{name}</span>;

	const renderExchange = () => (
		<div>
			<span className="text-table-body mr-1">{getExchangeName(exchange_code)}</span>
			<Tag className="mr-0">{uppercaseFirstLetter(exchangeMode)}</Tag>
		</div>
	);

	const renderPairWith = () => <p className="text-table-body">{pair}</p>;

	const renderCreated = () => renderDateTimeTable(created);

	const renderAction = () => (
		<div className="text-right inline-flex">
			<Button
				className="button-icon"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					history.push(`/presets/${type}/${id}`);
				}}
				data-qa="edit-preset-button"
				icon={<PenIcon />}
			/>
			<Button
				className="button-icon"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleDeleteFixedPreset(id);
				}}
				data-qa="delete-preset-button"
				icon={<DeleteIcon />}
			/>
		</div>
	);

	const infoItem = [
		{ label: 'name', itemRender: renderName(), id: 'name' },
		{ label: 'exchange', itemRender: renderExchange(), id: 'exchange' },
		{ label: 'pair_with', itemRender: renderPairWith(), id: 'pair_with' },
		{ label: 'created', itemRender: renderCreated(), id: 'created' },
		{ label: 'actions', itemRender: renderAction(), id: 'actions' },
	];

	return (
		<div
			key={id}
			className={`${
				typeTheme === 'light' ? 'border-[1px] border-[rgba(47, 50, 65, 0.25)]' : 'bg-[#151619]'
			} rounded-[8px] gap-4 mb-4 flex flex-col text-[14px] p-4`}
		>
			{(infoItem || []).map((i) => (
				<div className="flex flex-row items-center justify-between" key={i.id}>
					<p className="text-[12px]">{t(i.label)}</p>
					{i.itemRender}
				</div>
			))}
		</div>
	);
};

export default withTranslation()(CardItem);
