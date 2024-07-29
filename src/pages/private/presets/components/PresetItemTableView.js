import React from 'react';
import dayjs from 'dayjs';

const PresetItemTableView = ({ className, preset, onEdit, onDelete, ...props }) => (
	<div
		{...props}
		className={`${className} flex justify-between md:grid md:grid-cols-5 items-center`}
		data-qa="preset-item"
	>
		<div className="text-[16px] font-medium flex-1 col-span-2">{preset.name}</div>
		<div className="col-span-2 hidden md:block">
			{dayjs.tz(preset.created * 1000).format('DD-MM-YYYY HH:mm:ss')}
		</div>
		<div className="ml-4 text-right">
			<button
				className=" border p-2 inline-flex items-center justify-center border-r-0 rounded-l"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onEdit?.();
				}}
				data-qa="edit-preset-button"
			>
				<i className="fa fa-solid fa-pen" />
			</button>
			<button
				className=" border p-2 inline-flex items-center justify-center rounded-r"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onDelete?.();
				}}
				data-qa="delete-preset-button"
			>
				<i className="fa fa-solid fa-trash" />
			</button>
		</div>
	</div>
);

export default PresetItemTableView;
