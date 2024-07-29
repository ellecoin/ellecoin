import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react';
import { Redirect, Switch } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { PrivateRoute } from '../../utils/custom_route';
import Loading from '../../components/Loading';
import MainLayout from '../../components/layouts/main/MainLayout';

const Home = lazy(() => import('./dashboard' /* webpackChunkName: "home" */));
const MyWallets = lazy(() => import('./exchange/MyWallets'));
const ExchangeDetail = lazy(() => import('./exchange/ExchangeDetail'));
// const ListPreset = lazy(() => import('./presets/ListPreset' /* webpackChunkName: "presets" */));
// const CreatePreset = lazy(() => import('./presets/CreatePreset' /* webpackChunkName: "create preset" */));
const SpotOrders = lazy(() => import('./transactions/SpotOrders' /* webpackChunkName: "spot orders" */));
const ListBots = lazy(() => import('./bots/BotList' /* webpackChunkName: "bots" */));
const CreateBot = lazy(() => import('./bots/CreateBotForm' /* webpackChunkName: "create bot" */));
const BotDetail = lazy(() => import('./bots/BotDetail' /* webpackChunkName: "bot detail" */));
const AppProfile = lazy(() => import('./users/AppProfile' /* webpackChunkName: "profile" */));

const LayoutContent = observer(() => {
	const routes = [
		// Dashboard
		{ url: '', component: Home },
		{ url: 'home', component: Home },

		// MyExchanges
		{ url: 'exchanges', component: MyWallets },
		{ url: 'exchanges/:exchangeId', component: ExchangeDetail },

		// Ticker presets
		// { url: 'presets', component: ListPreset },
		// { url: 'presets/create', component: CreatePreset },
		// { url: 'presets/:type/:id', component: CreatePreset },

		// Transactions
		{ url: 'transactions', component: SpotOrders },

		// Bots
		{ url: 'bots', component: ListBots },
		{ url: 'bots/my-bot/create', component: CreateBot },
		{ url: 'bots/my-bot/detail/:botId', component: BotDetail },
		{ url: 'bots/my-bot/:action/:botId', component: CreateBot },

		{ url: 'app-profile', component: AppProfile },
		{ url: 'user/profile', component: AppProfile },
	];
	return (
		<MainLayout>
			<div className="container-fluid">
				<Suspense
					fallback={
						<div className="h-screen flex items-center justify-center">
							<Loading size="large" />
						</div>
					}
				>
					<Switch>
						{routes.map((data, i) => (
							<PrivateRoute key={i} exact path={`/${data.url}`} component={data.component} />
						))}
						<Redirect to="/404" />
					</Switch>
				</Suspense>
			</div>
		</MainLayout>
	);
});

// export default LayoutContent;
export default withTranslation()(LayoutContent);
