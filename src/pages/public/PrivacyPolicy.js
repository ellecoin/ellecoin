import React, { useContext, useEffect, useState } from 'react';
import { Layout, ConfigProvider } from 'antd';
import { withTranslation } from 'react-i18next';

import { useStore } from '../../context/AppContext';
import { ThemeContext } from '../../context/ThemeContext';
import MainFooter from '../../components/layouts/main/MainFooter';
import LandingPageHeader from '../../components/layouts/main/LandingPageHeader';

const { Content } = Layout;

const PrivacyPolicy = withTranslation()(({ t }) => {
	const { changeTheme, siteConfig } = useContext(ThemeContext);
	const [content, setContent] = useState(siteConfig);
	const { stateStore } = useStore();

	useEffect(() => {}, [stateStore.language]);
	useEffect(() => {
		changeTheme('light');
	}, []);
	return (
		<Layout>
			<Content>
				<Layout>
					<LandingPageHeader />
					<ConfigProvider>
						<Content className="md:mt-12 mt-5 overflow-auto">
							{/* eslint-disable-next-line prettier/prettier */}

							<article className="prose prose-headings:text-primary sm:prose-sm lg:prose-lg	 lg:prose-xl 2xl:prose-2xl m-auto">
								<h1> {t('privacy_policy')}</h1>
								<div
									className="prose-headings:text-primary text-primary"
									dangerouslySetInnerHTML={{
										__html: content?.informationPage?.privacyPolicy,
									}}
								/>
							</article>
						</Content>
					</ConfigProvider>
					<MainFooter />
				</Layout>
			</Content>
		</Layout>
	);
});

export default PrivacyPolicy;
