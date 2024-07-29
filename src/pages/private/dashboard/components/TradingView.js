import React, { useEffect, useMemo, useRef } from 'react';
import { Modal } from 'antd';

let tvScriptLoadingPromise;

export default function TradingViewWidgetModal({ open, typeTheme, language, onClose, dataFlow, timezone }) {
	const onLoadScriptRef = useRef();

	const cryptoParam = useMemo(() => {
		const { symbol, exchange_code, mode } = dataFlow;
		if (!symbol || !exchange_code || !mode) return;
		const converSymbol = symbol.replace('/', '').toUpperCase();
		const isFuture = mode === 'future' ? '.P' : ''; // FUTURE have .P , SPOT don't have anthing at end
		return `${exchange_code.toUpperCase()}:${converSymbol}${isFuture}`;
	}, [dataFlow]);

	useEffect(() => {
		if (!open) return;
		onLoadScriptRef.current = createWidget;

		if (!tvScriptLoadingPromise) {
			tvScriptLoadingPromise = new Promise((resolve) => {
				const script = document.createElement('script');
				script.id = 'tradingview-widget-loading-script';
				script.src = 'https://s3.tradingview.com/tv.js';
				script.type = 'text/javascript';
				script.onload = resolve;

				document.head.appendChild(script);
			});
		}

		tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

		return () => (onLoadScriptRef.current = null);

		function createWidget() {
			if (document.getElementById('tradingviewContainer') && 'TradingView' in window) {
				// eslint-disable-next-line no-new, new-cap
				new window.TradingView.widget({
					width: '100%',
					symbol: cryptoParam,
					interval: '60',
					timezone,
					theme: typeTheme,
					style: '1',
					locale: language,
					enable_publishing: false,
					allow_symbol_change: true,
					hide_side_toolbar: false,
					container_id: 'tradingviewContainer',
				});
			}
		}
	}, [open]);

	return (
		<Modal centered title="Trading View" open={open} footer={null} onCancel={onClose} width={1200}>
			<div className="tradingview-widget-container">
				<div id="tradingviewContainer" />
			</div>
		</Modal>
	);
}
