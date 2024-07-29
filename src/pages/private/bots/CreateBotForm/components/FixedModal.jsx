import React, { useMemo, useState, useContext, useEffect } from 'react';
import { Modal, Flex, Input, Form, Button, Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import CustomPagination from '../../../../../components/CustomPagination';
import { uppercaseFirstLetter } from '../../../../../utils/utils';
import { renderDateTimeTable, getExchangeName } from '../../../../../utils/helper';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { isNull } from '../../helper';
import TickerService from '../../../../../services/TickerService';

const FixedModal = ({ t, openFixedModal, exchangeInfo, onClose, selectedPairWith }) => {
	const [ordering] = useState('-created');
	const { typeTheme } = useContext(ThemeContext);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [isFetchingData, setIsFetchingData] = useState(false);
	const [rowSelectedId, setRowSelectedId] = useState(null);
	const [filter, setFilter] = useState({});
	const [selectRecord, setSelectRecord] = useState({});
	const [presetList, setPresetList] = useState([]);
	const form = Form.useFormInstance();
	const pageSize = 5;

	const handleSelectRecord = () => {
		const values = form.getFieldsValue();

		const filledInfo = {
			tickers: selectRecord.tickers,
		};

		form.setFieldsValue({ ...values, ...filledInfo });
		form.validateFields(['tickers']);
		onClose();
	};

	const fetchTickerPreset = () => {
		setIsFetchingData(true);
		TickerService.getTickerPreset({
			preset_name: filter.name || undefined,
			exchange_code: exchangeInfo?.exchange || undefined,
			exchange_mode: exchangeInfo?.mode || undefined,
			pair: selectedPairWith,
			limit: pageSize,
			offset: (currentPage - 1) * pageSize,
		})
			.then(({ count, results }) => {
				setTotal(count);
				setPresetList(
					results.map(
						({ tickers, id, preset_name, exchange, exchange_code, exchange_mode, pair, created }) => ({
							id,
							name: preset_name,
							exchange,
							pair,
							exchange_code,
							created: parseInt(created),
							exchangeMode: exchange_mode,
							tickers,
						})
					)
				);
			})
			.finally(() => setIsFetchingData(false));
	};

	useEffect(() => {
		fetchTickerPreset();
	}, [filter, currentPage, selectedPairWith]);

	const columns = useMemo(
		() => [
			{
				key: 'preset_name',
				title: <span className="text-table-header">{t('name')}</span>,
				dataIndex: 'name',
				render: (name) => <p className="text-table-body">{name}</p>,
			},
			{
				key: 'exchange',
				title: <span className="text-table-header">{t('exchange')}</span>,
				dataIndex: 'exchange_code',
				render: (exchangeCode, { exchangeMode }) => (
					<>
						<span className="text-table-body mr-2">{getExchangeName(exchangeCode)}</span>
						<Tag>{uppercaseFirstLetter(exchangeMode)}</Tag>
					</>
				),
			},
			{
				key: 'pair',
				title: <span className="text-table-header">{t('pair_with')}</span>,
				dataIndex: 'pair',
				render: (pair) => <p className="text-table-body">{pair}</p>,
			},
			{
				key: 'created',
				title: <span className="text-table-header">{t('created')}</span>,
				dataIndex: 'created',
				render: (created) => renderDateTimeTable(created),
			},
		],
		[ordering, typeTheme]
	);

	return (
		<Modal
			title={t('Load from Preset')}
			open={openFixedModal}
			onOk={onClose}
			onCancel={onClose}
			centered
			footer={[
				<Button
					disabled={isNull(rowSelectedId)}
					className={`${isNull(rowSelectedId) ? '' : 'button-primary'} ml-auto`}
					onClick={() => handleSelectRecord()}
				>
					{t('Select')}
				</Button>,
			]}
			width={1000}
		>
			<Flex justify="space-between" align="center" gap={16} className="mb-3">
				<Input
					className="py-[7px] w-fit"
					placeholder={t('Search preset name')}
					suffix={<SearchOutlined />}
					onBlur={(e) => {
						if (e.target.value !== filter.search) {
							setFilter({ ...filter, name: e.target.value });
						}
					}}
					onPressEnter={(e) => {
						setFilter({ ...filter, name: e.target.value });
					}}
					data-qa="preset-filter-name-input"
				/>
				<Link to="/presets?type=fixed" className="text-[#2180F8] text-[14px] underline whitespace-nowrap">
					{t('Preset manager')}
				</Link>
			</Flex>

			<Table
				className="presetModalTable"
				loading={isFetchingData}
				columns={columns}
				dataSource={presetList}
				rowKey="id"
				showSorterTooltip={false}
				pagination={false}
				onRow={(record) => ({
					onClick: () => {
						setSelectRecord(record);
						setRowSelectedId(record.id);
					},
				})}
				rowClassName={(record) => (record.id === rowSelectedId ? 'clickedRow' : '')}
				data-qa="preset-table"
				scroll={{ x: 460 }}
			/>
			<CustomPagination
				className="mt-3"
				total={total}
				currentPage={currentPage}
				pageSize={5}
				onChange={(page) => {
					setCurrentPage(page);
				}}
			/>
		</Modal>
	);
};

export default withTranslation()(observer(FixedModal));
