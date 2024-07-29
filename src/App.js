import React from 'react';
import { withResizeDetector } from 'react-resize-detector';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import utc from 'dayjs/plugin/utc';

/// Components
import AppContextProvider from './context/AppContext';
import ThemeContextProvider from './context/ThemeContext';

import Markup from './pages/index';
import GlobalStyle from './styles/GlobalStyle';
import { SocketContextProvider } from './context/SocketContext';
import LayoutContextProvider from './context/LayoutContext';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(weekday);
dayjs.extend(localeData);

const App = ({ width }) => (
	<AppContextProvider>
		<GlobalStyle />
		<ThemeContextProvider>
			<SocketContextProvider>
				<LayoutContextProvider>
					<Markup />
				</LayoutContextProvider>
			</SocketContextProvider>
		</ThemeContextProvider>
	</AppContextProvider>
);

export default withResizeDetector(App);
