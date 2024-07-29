import { Button, Flex, Modal, Typography, Upload } from 'antd';
import React, { useContext, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import ExportIcon from '../../../../../assets/icons/ExportIcon';
import { ImportFileIcon } from '../../../../../assets/icons/ImportFileIcon';
import { AcceptButton, CancelButton, LgText } from '../../../../../components';
import { ViewDetailNoFillIcon } from '../../../../../assets/icons/ViewDetail';
import { ThemeContext } from '../../../../../context/ThemeContext';
import BotService from '../../../../../services/BotService';
import { formatError } from '../../../../../utils/error';
import { useLayoutContext } from '../../../../../context/LayoutContext';

const { Dragger } = Upload;

const ACCEPT_EXTENSIONS = '.cvs,.xlsx,.xls';

const ImportBots = ({ reloadBotList, classes }) => {
	const { t } = useTranslation();
	const { typeTheme } = useContext(ThemeContext);
	const { onChangeModalConfigs } = useLayoutContext();

	const [openImportDialog, setOpenImportDialog] = useState(false);
	const [selectedFile, setSelectedFile] = useState();
	const [importing, setImporting] = useState(false);

	const onCloseImportDialog = () => setOpenImportDialog(false);

	const onOpenImportDialog = () => setOpenImportDialog(true);

	const onSubmitFile = () => {
		setImporting(true);
		const formData = new FormData();
		formData.append('file', selectedFile);
		BotService.importBots(formData)
			.then((res) => {
				reloadBotList?.();
				onCloseImportDialog();
			})
			.catch((err) => {
				onChangeModalConfigs({
					open: true,
					title: t('error'),
					children: formatError(err)?.message,
				});
			})

			.finally(() => setImporting(false));
	};

	const onSelectedFile = (e) => {
		setSelectedFile(e.file);
	};

	const onClearFile = () => setSelectedFile();

	return (
		<>
			<Button className={`button-primary flex gap-2 ${classes}`} onClick={onOpenImportDialog}>
				{t('import')}
				<ExportIcon width={16} height={16} />
			</Button>

			<StyledModal
				width={800}
				open={openImportDialog}
				onCancel={onCloseImportDialog}
				footer={null}
				title={t('import_files')}
			>
				<Dragger
					accept={ACCEPT_EXTENSIONS}
					showUploadList={false}
					onChange={onSelectedFile}
					beforeUpload={() => false}
					maxCount={1}
				>
					<Flex vertical className="items-center">
						<ImportFileIcon className="w-[100px] h-[100px]" />

						<LgText className="mt-1">
							<Trans
								i18nKey="drag_drop_file"
								components={{
									span: <span className="browser" />,
								}}
							/>
						</LgText>
						<LgText className="text-[#B2B3B5] my-1">{t('cvs_or_excel')}</LgText>
					</Flex>
				</Dragger>

				{!selectedFile ? (
					<Upload
						accept={ACCEPT_EXTENSIONS}
						showUploadList={false}
						beforeUpload={() => false}
						maxCount={1}
						className="mt-4 bg-white flex w-full rounded-[8px]"
						onChange={onSelectedFile}
					>
						<Flex className="justify-between items-center choose-box" gap={16}>
							<Typography className="text">{t('choose_file_browser')}</Typography>

							<Button>{t('choose_file')}</Button>
						</Flex>
					</Upload>
				) : (
					<Flex
						className="p-3 selected-box mt-4"
						gap={16}
						style={{
							backgroundColor: typeTheme === 'light' ? '#f0f3fa' : '#2F324180',
						}}
					>
						<CloseOutlined className="w-[10px] h-[10px] close-icon cursor-pointer" onClick={onClearFile} />
						<div className="file-box">
							<ViewDetailNoFillIcon color="#5D6589" />
						</div>
						<div>
							<LgText className="block">{selectedFile?.name}</LgText>
							<LgText
								style={{
									color: typeTheme === 'light' ? '#A5ADCF' : '#A5ADCF',
								}}
							>
								{(selectedFile?.size / 1000000).toFixed(3)} MB
							</LgText>
						</div>
					</Flex>
				)}

				<Flex justify="flex-end" gap={16} className="mt-4">
					<CancelButton onClick={onCloseImportDialog}>{t('cancel')}</CancelButton>
					<AcceptButton onClick={onSubmitFile} loading={importing}>
						{t('ok')}
					</AcceptButton>
				</Flex>
			</StyledModal>
		</>
	);
};

const StyledModal = styled(Modal)`
	.ant-modal-title {
		text-align: center;
	}
	.ant-upload-select {
		width: 100%;
	}
	.browser {
		color: #2180f8;
		text-decoration: underline;
	}
	.choose-box {
		border: 1px solid #d9d9d9;
		padding: 6px;
		border-radius: 8px;
		.text {
			color: #b2b3b5;
		}
		button {
			background-color: #b2b3b5;
			color: #fff;
			height: 32px;
			padding: 5px 16px;
			border: none;
		}
	}
	.selected-box {
		position: relative;
		border-radius: 8px;
		.close-icon {
			position: absolute;
			right: 8px;
			top: 8px;
		}
		.file-box {
			padding: 16px;
			border: 0.5px solid #5d6589;
			border-radius: 8px;
		}
	}
`;

export default ImportBots;
