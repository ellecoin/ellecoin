import { Button, Input, Tooltip } from 'antd';
import useDidMount from 'beautiful-react-hooks/useDidMount';
import React, { memo, useState } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import UserService from '../../../../services/UserService';

const ImportNote = () => {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);
	const [idAdress, setIdAdress] = useState('');

	const copyClipboard = () => {
		navigator.clipboard.writeText(idAdress.replaceAll(',', ' '));
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	useDidMount(() => {
		UserService.getProxieslist().then(({ proxies }) => setIdAdress(proxies.toString()));
	});

	return (
		<div className="flex flex-col mr-[9px]">
			<p className="font-medium mb-2 mt-8 text-primary">{t('important_note')}</p>
			<p className="text-secondary text-[14px]">{t('important_note_desc')}</p>
			<div className="w-full md:w-6/12 flex space-x-2 mt-2">
				<Input disabled type="text" value={idAdress} id="referrals" className="w-full h-[40px]" />
				<Tooltip placement="top" title={t('copied')} open={copied}>
					<Button icon={<CopyOutlined />} onClick={copyClipboard} className="ml-auto" disabled={false} />
				</Tooltip>
			</div>
		</div>
	);
};

export default memo(ImportNote);
