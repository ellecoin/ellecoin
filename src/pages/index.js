import React, { Suspense, lazy, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react';
import Loading from '../components/Loading';
import { GuestRoute, InformationRoute } from '../utils/custom_route';
import LayoutContent from './private';
import ToastContainerComponent from '../components/Toastify';
import ScrollToTop from '../components/ScrollToTop';
import { siteConfig } from '../data/SiteConfig';
import { useAuth } from '../context/AppContext';

const LandingLayout = lazy(() => import('./public/Landing/index'));
const Login = lazy(() => import('./public/Login'));
const ForgotPassword = lazy(() => import('./public/ForgotPassword'));
const ActivateResult = lazy(() => import('./public/ActivateResult'));
const ResetPassword = lazy(() => import('./public/ResetPassword'));
const Registration = lazy(() => import('./public/Registration'));
const Error404 = lazy(() => import('./public/Error404'));
const TermOfUse = lazy(() => import('./public/TermOfUse'));
const PrivacyPolicy = lazy(() => import('./public/PrivacyPolicy'));

const Markup = () => {
	const { isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center">
				<Loading size="large" />
			</div>
		);
	}
	return (
		<Router basename="/">
			<ScrollToTop />
			<Helmet>
				<link rel="shortcut icon" href="/favicon.png" />
				<title>{siteConfig.title}</title>
				<link rel="shortcut icon" href="/favicon.png" />
				<link rel="apple-touch-icon" href="/favicon.png" />
			</Helmet>
			<Suspense
				fallback={
					<div className="h-screen flex items-center justify-center">
						<Loading size="large" />
					</div>
				}
			>
				<Switch>
					<GuestRoute exact path="/home" component={LandingLayout} />
					<GuestRoute exact path="/about" component={LandingLayout} />
					<GuestRoute exact path="/pricing" component={LandingLayout} />
					<GuestRoute exact path="/blog" component={LandingLayout} />
					<GuestRoute exact path="/whitepaper" component={LandingLayout} />

					<GuestRoute exact path="/login" component={Login} />
					<GuestRoute exact path="/forgot-password" component={ForgotPassword} />
					<GuestRoute exact path="/reset-password" component={ResetPassword} />
					<GuestRoute exact path="/activate/:result" component={ActivateResult} />
					<GuestRoute exact path="/sign-up" component={Registration} />
					<InformationRoute exact path="/term-of-use" component={TermOfUse} />
					<InformationRoute exact path="/privacy-policy" component={PrivacyPolicy} />
					<Route exact path="/404" component={Error404} />
					<Route path="/" component={LayoutContent} />
				</Switch>

				<ToastContainerComponent />
			</Suspense>
		</Router>
	);
};

export default observer(Markup);
