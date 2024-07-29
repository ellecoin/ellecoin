import React, { useContext, useMemo } from 'react';
import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../../../data/SiteConfig';

const { Footer } = Layout;

const MainFooter = () => {
	const { pathname } = useLocation();
	const routes = ['bots/my-bot/create', 'bots/my-bot/update', 'presets/create', 'presets/fixed'];

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const hiddenFooter = useMemo(() => routes.some((path) => pathname?.includes(path)), [pathname]);

	return !hiddenFooter ? (
		<Footer className="footer">
			{siteConfig.copyRightContent ? (
				<div
					className="copyright text-center text-[12px] md:text-[14px]"
					dangerouslySetInnerHTML={{
						__html: siteConfig.copyRightContent.replaceAll('{{year}}', new Date().getFullYear()),
					}}
				/>
			) : (
				<div className="copyright text-center text-[12px] md:text-[14px]">
					<p>Copyright © Yoor Technologies {d.getFullYear()}</p>
				</div>
			)}
		</Footer>
	) : null;
};

export default MainFooter;
