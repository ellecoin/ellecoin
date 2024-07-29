import React, { useContext } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import { ThemeContext } from '../../../../../context/ThemeContext';
import { themeObject } from '../../../../../styles/themes/themeVariables';
import icons from '../../../../../assets/icons/logo/index';

const { Header } = Layout;

const HeaderLanding = () => {
	const { t } = useTranslation();
	const { typeTheme } = useContext(ThemeContext);
	const isMobile = useMediaQuery('(max-width: 567px)');
	const isDesktop = useMediaQuery('(min-width: 992px)');

	const menuItems = [
		{ key: '1', label: <Link to="/home">{t('Home')}</Link> },
		{ key: '2', label: <Link to="/about">{t('About')}</Link> },
		{ key: '3', label: <Link to="/pricing">{t('Pricing')}</Link> },
		{ key: '4', label: <Link to="/blog">{t('Blog')}</Link> },
		{ key: '5', label: <Link to="/whitepaper">{t('Whitepaper')}</Link> },
	];

	return (
		<Header style={{ backgroundColor: themeObject[typeTheme].backgroundLanding }} className="landing-header">
			<Link to="/" className="landing-header-logo">
				{isDesktop ? icons.logoFull : icons.logoMobile}
			</Link>
			<Menu mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} className="landing-header-menu" />
			<div
				className="header-right"
				style={{
					justifyContent: isMobile ? 'center' : 'flex-end',
					width: !isDesktop ? '40%' : '20%',
					flexDirection: isMobile ? 'column' : 'row',
				}}
			>
				<Link to="/login" className="landing-sign-in">
					{t('Sign in')}
				</Link>
				<Button type="primary" className="button-landing" style={{ marginTop: isMobile ? '3px' : '0' }}>
					{t('Try now')}
				</Button>
			</div>
		</Header>
	);
};

export default HeaderLanding;
