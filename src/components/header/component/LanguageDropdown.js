import React, { useState } from 'react';
import { Divider, Popover } from 'antd';
import { withTranslation } from 'react-i18next';
import { DownOutlined } from '@ant-design/icons';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import EnFlag from '../../../assets/icons/EnFlag';
import PtFlag from '../../../assets/icons/PtFlag';
import { getLanguageLabel } from '../../../utils/helper';
import { useStore } from '../../../context/AppContext';
import CheckedIcon from '../../../assets/icons/CheckedIcon';
import EsFlag from '../../../assets/icons/EsFlag';
import VnFlag from '../../../assets/icons/VnFlag';

const LanguageDropdown = ({ i18n }) => {
	const { stateStore } = useStore();
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width: 640px)');

	const renderFlag = (flagId) => {
		const [width, height] = isMobile ? [30, 30] : [21, 21];
		const flag = flagId || stateStore.language;
		switch (flag) {
			case 'es':
				return <EsFlag width={width} height={height} className="rounded-full" />;
			default:
				return <EnFlag width={width} height={height} className="rounded-full" />;
		}
	};

	const onSelectLanguage = (key) => {
		stateStore.setLanguage(key);
		i18n.changeLanguage(key).then();
		setOpen(false);
	};

	const LANGUAGE_LIST_INFO = [{ value: 'en', label: 'English', id: 'en' }];

	const content = (
		<div className="w-[150px] menu-primary">
			{LANGUAGE_LIST_INFO.map(({ value, label, id }, idx) => (
				<div key={id}>
					<div
						className="flex gap-2 items-center h-[48px] cursor-pointer menu-item px-[6px]"
						onClick={() => onSelectLanguage(value)}
						key={id}
					>
						{renderFlag(value)}
						<span className="grow">{label}</span>
						{stateStore.language === value ? <CheckedIcon /> : ''}
					</div>
					{idx < LANGUAGE_LIST_INFO.length - 1 ? <Divider className="m-0" /> : ''}
				</div>
			))}
		</div>
	);

	return (
		<Popover
			getPopupContainer={(trigger) => trigger.parentElement}
			open={open}
			onOpenChange={() => setOpen(!open)}
			trigger="click"
			placement="bottom"
			content={content}
			arrow
		>
			<div className="cursor-pointer h-full flex items-center text-primary text-[14px]">
				<div className="flex items-center justify-end">
					<div className={!isMobile ? 'mr-[14px]' : ''}>{renderFlag()}</div>
					{!isMobile && getLanguageLabel(stateStore.language)}
					{!isMobile && (
						<div className="ml-[16px]">
							<DownOutlined />
						</div>
					)}
				</div>
			</div>
		</Popover>
	);
};

export default withTranslation()(LanguageDropdown);
