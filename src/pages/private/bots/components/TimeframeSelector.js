import { withTranslation } from 'react-i18next';
import { Divider, InputNumber, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

export const getTimeFrameLabel = (t, value) => {
	if (value % (60 * 60 * 24 * 30) === 0) {
		return t('month_count', { count: value / (60 * 60 * 24 * 30) });
	}
	if (value % (60 * 60 * 24 * 7) === 0) {
		return t('week_count', { count: value / (60 * 60 * 24 * 7) });
	}
	if (value % (60 * 60 * 24) === 0) {
		return t('day_count', { count: value / (60 * 60 * 24) });
	}
	if (value % (60 * 60) === 0) {
		return t('hour_count', { count: value / (60 * 60) });
	}
	if (value % 60 === 0) {
		return t('minute_count', { count: value / 60 });
	}
	return t('second_count', { count: value });
};

const TimeframeSelector = ({ t, value, onChange, disabled, className }) => {
	const [customTimeframes, setCustomTimeframes] = useState([]);
	const [cusNumber, setCusNumber] = useState(null);
	const [cusUnit, setCusUnit] = useState(null);
	const [reservedOptions] = useState(
		[
			...[3, 5, 10, 15, 30].map((count) => ({
				value: count,
				label: t('second_counts', { count }),
			})),
			{
				value: 60,
				label: t('minute_count'),
			},
			...[3, 5, 15, 30, 45].map((count) => ({
				value: count * 60,
				label: t('minute_counts', { count }),
			})),
			{
				value: 60 * 60,
				label: t('hour_count'),
			},
			...[2, 3, 4, 6, 12].map((count) => ({
				value: count * 60 * 60,
				label: t('hour_counts', { count }),
			})),
			...[
				{
					value: 60 * 60 * 24,
					label: t('day_count'),
				},
				{
					value: 60 * 60 * 24 * 7,
					label: t('week_count'),
				},
				{
					value: 60 * 60 * 24 * 30,
					label: t('month_count'),
				},
			],
		].reduce((result, { value, label }) => ({ ...result, [value]: label }), {})
	);

	const getCustomTimeFrame = (value) => {
		if (value % (60 * 60 * 24 * 30) === 0 && value / (60 * 60 * 24 * 30) >= 2) {
			return [
				{
					value,
					label: t('month_counts', { count: value / (60 * 60 * 24 * 30) }),
				},
			];
		}
		if (value % (60 * 60 * 24 * 7) === 0 && value / (60 * 60 * 24 * 7) >= 2) {
			return [
				{
					value,
					label: t('week_counts', { count: value / (60 * 60 * 24 * 7) }),
				},
			];
		}
		if (value % (60 * 60 * 24) === 0) {
			if (![1, 7, 30].includes(value / (60 * 60 * 24))) {
				return [{ value, label: t('day_counts', { count: value / (60 * 60 * 24) }) }];
			}
			return [];
		}
		if (value % (60 * 60) === 0) {
			if (![1, 2, 3, 4, 6, 12].includes(value / (60 * 60))) {
				return [{ value, label: t('hour_counts', { count: value / (60 * 60) }) }];
			}
			return [];
		}
		if (value % 60 === 0) {
			if (![1, 3, 5, 15, 30, 45].includes(value / 60)) {
				return [{ value, label: t('minute_counts', { count: value / 60 }) }];
			}
			return [];
		}
		if (![3, 5, 10, 15, 30].includes(value)) {
			return [{ value, label: t('second_counts', { count: value }) }];
		}
		return [];
	};

	const addCustomTimeframe = (v, unit) => {
		let info = {};
		switch (unit) {
			case 'month':
				info = {
					value: v * 60 * 60 * 24 * 30,
					label: t('month_count', { count: v }),
				};
				break;
			case 'week':
				info = {
					value: v * 60 * 60 * 24 * 7,
					label: t('week_count', { count: v }),
				};
				break;
			case 'day':
				info = { value: v * 60 * 60 * 24, label: t('day_count', { count: v }) };
				break;
			case 'hour':
				info = { value: v * 60 * 60, label: t('hour_count', { count: v }) };
				break;
			case 'minute':
				info = { value: v * 60, label: t('minute_count', { count: v }) };
				break;
			default:
				info = { value: v, label: t('second_count', { count: v }) };
				break;
		}

		if (reservedOptions[info.value]) {
			onChange(info.value);
		} else {
			setCustomTimeframes([...customTimeframes, info]);
			onChange(info.value);
		}
	};

	useEffect(() => {
		setCustomTimeframes(getCustomTimeFrame(value));
	}, [value]);

	return (
		<Tooltip title={disabled && t('Please stop your bot before editing')}>
			<Select
				className={`${className}`}
				value={value}
				onChange={(v) => {
					if (reservedOptions[v]) {
						setCusNumber(null);
						setCusUnit(null);
					}
					onChange(v);
				}}
				dropdownRender={(menu) => (
					<>
						<div className="flex gap-2 px-2 py-1">
							<InputNumber
								className="flex-1"
								placeholder="15"
								value={cusNumber}
								onChange={(v) => setCusNumber(v)}
								onPressEnter={(e) => {
									e.preventDefault();
									e.stopPropagation();
									if (cusUnit) {
										addCustomTimeframe(parseInt(e.target.value), cusUnit);
									}
								}}
							/>
							<Select
								className="w-[120px]"
								placeholder={t('minutes')}
								value={cusUnit}
								onChange={(v) => {
									setCusUnit(v);
									if (cusNumber) {
										addCustomTimeframe(parseInt(cusNumber), v);
									}
								}}
								options={[
									{ value: 'second', label: t('seconds') },
									{ value: 'minute', label: t('minutes') },
									{ value: 'hour', label: t('hours') },
									{ value: 'day', label: t('days') },
									{ value: 'week', label: t('weeks') },
									{ value: 'month', label: t('months') },
								]}
							/>
						</div>
						<Divider style={{ margin: '8px 0' }} />
						{menu}
					</>
				)}
				options={[
					...[
						{
							label: <span className="capitalize">{t('seconds')}</span>,
							options: [3, 5, 10, 15, 30].map((count) => ({
								value: count,
								label: t('second_counts', { count }),
							})),
						},
						{
							label: <span className="capitalize">{t('minutes')}</span>,
							options: [1, 3, 5, 15, 30, 45].map((count) => ({
								value: count * 60,
								label: t(count === 1 ? 'minute_count' : 'minute_counts', {
									count,
								}),
							})),
						},
						{
							label: <span className="capitalize">{t('hours')}</span>,
							options: [1, 2, 3, 4, 6, 12].map((count) => ({
								value: count * 60 * 60,
								label: t(count === 1 ? 'hour_count' : 'hour_counts', { count }),
							})),
						},
						{
							label: <span className="capitalize">{t('days')}</span>,
							options: [
								{
									value: 60 * 60 * 24,
									label: t('day_count', { count: 1 }),
								},
								{
									value: 60 * 60 * 24 * 7,
									label: t('week_count', { count: 1 }),
								},
								{
									value: 60 * 60 * 24 * 30,
									label: t('month_count', { count: 1 }),
								},
							],
						},
					],
					...(customTimeframes.length > 0 ? [{ label: t('Customs'), options: customTimeframes }] : []),
				]}
				disabled={disabled}
				data-qa="bot-time-frame"
			/>
		</Tooltip>
	);
};

export default withTranslation()(TimeframeSelector);
