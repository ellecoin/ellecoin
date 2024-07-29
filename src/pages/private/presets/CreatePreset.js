import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { observer } from 'mobx-react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, ConfigProvider, Form } from 'antd';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';
import ExportIcon from '../../../assets/icons/ExportIcon';
import CreateTickerPresetView from './components/CreateTickerPresetView';
import tickerService from '../../../services/TickerService';
import exchangeService from '../../../services/ExchangeService';
import Loading from '../../../components/Loading';
import { ThemeContext } from '../../../context/ThemeContext';
import { themeObject } from '../../../styles/themes/themeVariables';
import { useStore } from '../../../context/AppContext';
import { useLayoutContext } from '../../../context/LayoutContext';
import { siteConfig } from '../../../data/SiteConfig';

const CreatePreset = ({ t }) => {
	const { typeTheme } = useContext(ThemeContext);
	const { stateStore } = useStore();
	const [exporting, setExporting] = useState(false);
	const { onChangeModalConfigs } = useLayoutContext();

	const { supportExchanges } = siteConfig;
	const supportExchangeCodes = supportExchanges.reduce((result, { code }) => ({ ...result, [code]: true }), {});
	const history = useHistory();
	const { search } = useLocation();
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const { id, type } = useParams();
	const [exchanges, setExchanges] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingPreset, setLoadingPreset] = useState(true);
	const [form] = Form.useForm();
	const currentPresetInfo = useRef({
		filter_type: query.get('type') || 'fixed',
	});
	const [errors, setErrors] = useState({});
	const today = dayjs(Date.now()).format('DD-MM-YYYY');

	const createMode = !id && !type;

	useEffect(() => {
		const promises = [exchangeService.getIntegratedExchanges()];
		if (id && type === 'fixed') {
			promises.push(
				tickerService.getTickerPresetDetail(id).then((res) => {
					const info = {
						name: res.preset_name,
						filter_type: type,
						tickers: res.tickers,
						exchange: res.exchange,
						pair_with: res.pair,
					};
					currentPresetInfo.current = { ...info };
				})
			);
		}

		Promise.all(promises)
			.then(([{ results }]) => {
				const acceptedExchanges = results.filter(({ exchange }) => supportExchangeCodes[exchange]);
				setExchanges(acceptedExchanges);
				if (!id) {
					currentPresetInfo.current.exchange = acceptedExchanges[0]?.id;
					currentPresetInfo.current.pair_with = 'USDT';
				}
				form.setFieldsValue({
					preset: { ...currentPresetInfo.current },
				});
			})
			.catch(({ status_code }) => {
				if (status_code === 404) {
					history.replace('/404');
				}
			})
			.finally(() => setLoadingPreset(false));
	}, []);

	const handleCreateTickerPreset = (preset) =>
		tickerService.createTickerPreset(
			preset.name,
			preset.tickers.join(', '),
			preset.exchange,
			preset.pair_with,
			preset.mode
		);

	const convertData = (data) => {
		const selectedItem = exchanges.find((ex) => ex.id === data.exchange);
		return { ...data, mode: selectedItem.mode };
	};

	const handleSubmit = async () => {
		try {
			const { preset } = await form.validateFields();
			const values = convertData(preset);
			setLoading(true);
			let p = null;
			if (id && type === 'fixed') {
				p = tickerService.updateTickerPreset(id, {
					preset_name: values.name,
					tickers: values.tickers.join(', '),
					exchange: values.exchange,
					pair: values.pair_with,
				});
			} else {
				p = handleCreateTickerPreset(values);
			}
			p.then((res) => {
				history.replace('/presets');
				onChangeModalConfigs({
					open: true,
					title: createMode ? t('create_preset_success') : t('update_success'),
					children: createMode ? t('new_preset_have_created') : t('ticker_preset_updated'),
					onOk: () => {
						history.replace(`/bots/my-bot/create?preset=${res.id}&preset_type=${values.filter_type}`);
					},
					type: 'success',
					okText: t('create_bot'),
				});
			}).finally(() => setLoading(false));
		} catch (e) {
			let element = document.getElementsByClassName('ant-form-item-has-error')?.[0];
			if (!element) {
				element = document.getElementsByClassName('rule_item_wrapper border-[red]')?.[0];
			}
			if (element) {
				const distance = element.offsetTop - window.scrollY;
				window.scrollBy({ top: distance, left: 0, behavior: 'smooth' });
			}
		}
	};

	const handleDeleteFixedPreset = () => {
		onChangeModalConfigs({
			open: true,
			children: t('delete_preset_confirm'),
			title: t('delete_confirm'),
			onOk: () => {
				tickerService.deleteFixedPreset(id).then(() => {
					history.goBack();
				});
			},
			type: 'error',
		});
	};

	useEffect(() => {
		const errorFields = form.getFieldsError().reduce((arr, field) => {
			if (field.errors.length) {
				arr.push(field.name);
			}
			return arr;
		}, []);
		form.validateFields(errorFields);
	}, [stateStore.language]);

	if (loadingPreset) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Loading size="large" />
			</div>
		);
	}

	const themeConfig = {
		components: {
			Input: {
				controlHeight: 60,
				fontSize: 16,
			},
			Select: {
				controlHeight: 60,
				fontSize: 16,
				controlHeightSM: 56,
				colorSplit: themeObject[typeTheme].inputBg,
				colorFillSecondary: themeObject[typeTheme].colorBgSelectItem,
			},
			Radio: {
				controlHeight: 20,
				colorPrimary: themeObject[typeTheme].colorRadioPrimary,
				colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
			},
		},
	};

	const handleExport = () => {
		setExporting(true);
		tickerService
			.exportPreset({ id }, type)
			.then((res) => {
				fileDownload(res, `${currentPresetInfo.current?.name}_${today}.csv`);
			})
			.catch((err) => {
				console.log('Error exporting preset', err);
			})
			.finally(() => setExporting(false));
	};

	return (
		<div className="px-4 md:px-8">
			<ConfigProvider theme={themeConfig}>
				<div className="flex justify-between items-center mb-4">
					<p className="text-primary text-[16px] font-semibold">
						{createMode ? t('create_preset') : t('update_preset')}
					</p>
					<div className="gap-2 inline-flex">
						{!createMode ? (
							<Button
								className="button-primary flex items-center gap-[10px] font-semibold w-full md:w-auto"
								type="primary"
								loading={exporting}
								onClick={() => handleExport()}
							>
								{t('Export')}
								<ExportIcon width={16} height={16} />
							</Button>
						) : null}

						<Button
							className="button-primary"
							type="primary"
							loading={loading}
							onClick={() => handleSubmit()}
							data-qa="save-preset-button"
						>
							{createMode ? t('save') : t('update')}
						</Button>
						{!createMode && (
							<Button
								className="button-primary--danger"
								type="danger"
								onClick={() => handleDeleteFixedPreset()}
								data-qa="delete-preset-button"
							>
								{t('delete')}
							</Button>
						)}
					</div>
				</div>
				<Form
					form={form}
					initialValues={{
						preset: { ...currentPresetInfo.current, mode: '' },
					}}
					onValuesChange={(values) => {
						setErrors({});
						if (values.preset?.filter_type) {
							history.replace(`/presets/create?type=${values.preset.filter_type}`);
						}
					}}
				>
					<div className="card-primary">
						<CreateTickerPresetView
							formWrapper="preset"
							isUpdateMode={!createMode}
							presetNameValidate={(value, type) => {
								if (id && value === currentPresetInfo.current?.name) {
									return Promise.resolve();
								}
								return tickerService
									.validatePresetName(value, type)
									.then(() => Promise.resolve())
									.catch(({ errors }) => Promise.reject(t(errors.message)));
							}}
							exchanges={exchanges}
						/>
					</div>
				</Form>
			</ConfigProvider>
		</div>
	);
};

export default observer(withTranslation()(CreatePreset));
