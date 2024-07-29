import React, { useState, useEffect, useMemo, useContext } from 'react';
import { observer } from 'mobx-react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Tabs, ConfigProvider } from 'antd';
import Overview from './Tabs/Overview';
import { getThemeConfig } from './helper';
import botService from '../../../../services/BotService';
import { useStore } from '../../../../context/AppContext';
import Loading from '../../../../components/Loading';
import { ThemeContext } from '../../../../context/ThemeContext';
import Detail from './Tabs/Detail';

const BotDetail = ({ t }) => {
	const { stateStore } = useStore();
	const history = useHistory();
	const { botId } = useParams();
	const [botInfo, setBotInfo] = useState({});
	const [loadingBotInfo, setLoadingBotInfo] = useState(true);
	const { typeTheme } = useContext(ThemeContext);
	const { search } = useLocation();
	const searchParams = useMemo(() => new URLSearchParams(search), [search]);
	const isBotTemplate = useMemo(() => searchParams.get('detail-template'), [searchParams]);
	const themeConfig = getThemeConfig(typeTheme);

	useEffect(() => {
		stateStore.setHeaderTitle(t('bot_detail'));
	}, []);

	// TODO: refactor 2 functions getBotDetail - getBotTemplateDetail
	const getBotDetail = () => {
		botService
			.getBotDetail(botId)
			.then((res) => {
				setBotInfo(res);
			})
			.catch(({ status_code }) => {
				if (status_code === 404) {
					history.replace('/404');
				}
			})
			.finally(async () => {
				setLoadingBotInfo(false);
			});
	};

	const getBotTemplateDetail = () => {
		botService
			.getBotTemplateDetail(botId)
			.then((res) => {
				setBotInfo(res);
			})
			.catch(({ status_code }) => {
				if (status_code === 404) {
					history.replace('/404');
				}
			})
			.finally(async () => {
				setLoadingBotInfo(false);
			});
	};

	useEffect(() => {
		if (isBotTemplate) {
			getBotTemplateDetail();
		} else getBotDetail();
	}, [isBotTemplate]);

	if (loadingBotInfo) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Loading size="large" />
			</div>
		);
	}

	return (
		<ConfigProvider theme={themeConfig}>
			<div className="px-4 md:px-6">
				<p className="font-semibold mb-4 text-primary">{botInfo.name}</p>
				<Tabs
					defaultActiveKey="overview"
					items={[
						{
							label: t('Overview'),
							key: 'overview',
							children: <Overview {...{ botInfo }} />,
						},
						{
							label: t('Detail'),
							key: 'detail',
							children: <Detail {...{ botInfo, setBotInfo }} />,
						},
					]}
				/>
			</div>
		</ConfigProvider>
	);
};

export default observer(withTranslation()(BotDetail));
