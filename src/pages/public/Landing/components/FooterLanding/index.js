import React, { useContext } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import logoIcons from '../../../../../assets/icons/logo/index';
import SocialMenu from './SocialMenu';
import LanguageDropdownFooter from './LanguageDropdownFooter';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { themeObject } from '../../../../../styles/themes/themeVariables';

const { Footer } = Layout;

const FooterLanding = () => {
	const { t } = useTranslation();
	const { typeTheme } = useContext(ThemeContext);
	const currentYear = new Date().getFullYear();
	const isMobile = useMediaQuery('(max-width: 567px)');

	const menuItems = [
		{ key: '1', label: <Link to="/home">{t('Home')}</Link> },
		{ key: '2', label: <Link to="/about">{t('About')}</Link> },
		{ key: '3', label: <Link to="/pricing">{t('Pricing')}</Link> },
		{ key: '4', label: <Link to="/blog">{t('Blog')}</Link> },
		{ key: '5', label: <Link to="/whitepaper">{t('Whitepaper')}</Link> },
	];

	return (
		<Footer
			style={{
				padding: isMobile ? '10px 5px' : '65px 20px',
				backgroundColor: themeObject[typeTheme].backgroundLanding,
			}}
		>
			<div className="landing-footer" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
				<div style={{ padding: isMobile ? '0 0 10px 30px' : '0' }}>
					<div>{logoIcons.logoMobile}</div>
					<h3 className="landing-footer-title">{t('Designed by Ali Hamza')}</h3>
					<SocialMenu />
					<p className="landing-footer-text">
						{currentYear} ElleCoin.{t('All rights reserved')}
					</p>
				</div>

				<div className="landing-footer-right">
					<div>
						<h3 className="landing-footer-brand">Ellecoin</h3>
						<Menu mode="vertical" items={menuItems} className="landing-footer-menu" />
					</div>
					<div className="landing-footer-dropdown" style={{ marginLeft: isMobile ? '0' : '70px' }}>
						<LanguageDropdownFooter />
					</div>
				</div>
			</div>
		</Footer>
	);
};

export default FooterLanding;
