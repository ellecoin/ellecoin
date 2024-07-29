import React, { lazy, Suspense, useContext } from 'react';
import { Layout } from 'antd';
import { Switch, Route } from 'react-router-dom';
import ExclusiveOffer from './components/ExclusiveOffer';
import HeaderLanding from './components/HeaderLanding';
import Loading from '../../../components/Loading';
import { ThemeContext } from '../../../context/ThemeContext';
import { themeObject } from '../../../styles/themes/themeVariables';
import FooterLanding from './components/FooterLanding';

const Home = lazy(() => import('./pages/Landing'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Blog = lazy(() => import('./pages/Blog'));
const Whitepaper = lazy(() => import('./pages/Whitepaper'));
const Login = lazy(() => import('../Login'));

const routes = [
	{ path: '/home', component: Home, exact: true },
	{ path: '/about', component: About, exact: true },
	{ path: '/pricing', component: Pricing, exact: true },
	{ path: '/blog', component: Blog, exact: true },
	{ path: '/whitepaper', component: Whitepaper, exact: true },
	{ path: '/login', component: Login, exact: true },
];

const { Content } = Layout;

const LandingLayout = () => {
	const { typeTheme } = useContext(ThemeContext);

	return (
		<Layout
			className="relative min-h-screen"
			style={{ backgroundColor: themeObject[typeTheme].backgroundLanding, maxWidth: '1732px', margin: '0 auto' }}
		>
			<ExclusiveOffer />
			<HeaderLanding />
			<Content>
				<Suspense fallback={<Loading size="large" />}>
					<Switch>
						{routes.map(({ path, component, exact }, index) => (
							<Route key={index} path={path} exact={exact} component={component} />
						))}
					</Switch>
				</Suspense>
			</Content>
			<FooterLanding />
		</Layout>
	);
};

export default LandingLayout;
