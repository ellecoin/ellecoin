import { useEffect, useState, createContext, useRef, useMemo, useContext } from 'react';
import { useStore } from './AppContext';

export const SocketContext = createContext({});

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = (props) => {
	const { authStore, tokenStore } = useStore();
	const ws = useRef(null);
	const [notificationData, setNotificationData] = useState(null);
	const [backtestData, setBacktestData] = useState(null);
	const [backtestJobData, setBacktestJobData] = useState(null);
	const [reloadBotsSocket, setReloadBotsSocket] = useState();
	const [invoiceData, setInvoiceData] = useState(null);
	const [retryCount, setRetryCount] = useState(0); // Track the number of retries
	const contextValue = useMemo(
		() => ({
			notificationData,
			backtestData,
			invoiceData,
			backtestJobData,
			reloadBotsSocket,
		}),
		[notificationData, backtestData, reloadBotsSocket, backtestJobData, invoiceData]
	);

	const connectWebSocket = () => {
		if (!tokenStore.getToken()) return;
		const socketUrl = `${process.env.REACT_APP_WSS_URL}?token=${tokenStore.getToken()}`;
		ws.current = new WebSocket(socketUrl);
		ws.current.onmessage = onMessage;
		ws.current.onopen = (e) => {
			setRetryCount(0); // Reset retry count on successful connection
		};
		ws.current.onclose = (e) => {
			retryConnection();
		};
	};

	const retryConnection = () => {
		if (retryCount < 5) {
			// Maximum 5 retries, you can adjust this as needed
			const retryTimeout = 2 ** retryCount * 1000; // Exponential backoff for retry interval
			setTimeout(() => {
				setRetryCount((prevCount) => prevCount + 1);
				connectWebSocket();
			}, retryTimeout);
		}
	};

	const onMessage = (value) => {
		const resp = JSON.parse(value.data);
		if (resp.type === 'notify') {
			setNotificationData(resp.body);
			authStore.setUnreadNotifyCount(authStore.unreadNotifyCount + 1);
		}
		if (resp.type === 'backtest') {
			setBacktestData(resp.body);
		}
		if (resp.type === 'backtest_job') {
			setBacktestJobData(resp.body);
		}
		if (resp.type === 'bot_change_status') {
			setReloadBotsSocket(resp.body);
		}
		if (resp.type === 'invoice_update') {
			setInvoiceData(resp.body);
		}
	};

	useEffect(() => {
		connectWebSocket();
		return () => {
			if (ws.current) {
				ws.current.close();
			}
		};
	}, [tokenStore.getToken()]);

	return <SocketContext.Provider value={contextValue}>{props.children}</SocketContext.Provider>;
};
