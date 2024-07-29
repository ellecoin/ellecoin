import { useState, useEffect } from 'react';

const defaultColors = ['#A62A21', '#7e3794', '#0B51C1', '#3A6024', '#A81563', '#B3003C'];

const _stringAsciiPRNG = (value, m) => {
	// Xn+1 = (a * Xn + c) % m
	// 0 < a < m
	// 0 <= c < m
	// 0 <= X0 < m

	const charCodes = [...value].map((letter) => letter.charCodeAt(0));
	const len = charCodes.length;

	const a = (len % (m - 1)) + 1;
	const c = charCodes.reduce((current, next) => current + next) % m;

	let random = charCodes[0] % m;
	for (let i = 0; i < len; i += 1) random = (a * random + c) % m;

	return random;
};

const getRandomColor = (value, colors = defaultColors) => {
	// if no value is passed, always return transparent color otherwise
	// a rerender would show a new color which would will
	// give strange effects when an interface is loading
	// and gets rerendered a few consequent times
	if (!value) return 'transparent';

	// value based random color index
	// the reason we don't just use a random number is to make sure that
	// a certain value will always get the same color assigned given
	// a fixed set of colors
	const colorIndex = _stringAsciiPRNG(value, colors.length);
	return colors[colorIndex];
};

const CoinIcon = ({ className, symbol, size, showAlt = true }) => {
	const [error, setError] = useState(false);
	const [formatSymbol, setFormatSymbol] = useState(symbol);

	useEffect(() => {
		const { length } = symbol;
		let tmpSymbol = symbol.toLowerCase();
		if (tmpSymbol.includes('down', length - 4) && length > 4) {
			tmpSymbol = tmpSymbol.replace('down', '');
		} else if (tmpSymbol.includes('up', length - 2) && length > 3) {
			tmpSymbol = tmpSymbol.replace('up', '');
		}
		setFormatSymbol(tmpSymbol);
		setError(false);
	}, [symbol]);

	if (!error) {
		return (
			<img
				className={`${className} inline-block ${error ? 'invisible' : ''}`}
				src={`/media/icons/${formatSymbol}.png`}
				alt={showAlt ? symbol : ''}
				style={{ width: size }}
				onError={() => {
					setError(true);
				}}
			/>
		);
	}

	const bg = getRandomColor(symbol);
	return (
		<div
			className={`${className} rounded-full inline-flex justify-center items-center`}
			style={{ width: size, height: size, background: bg }}
		>
			<span className="text-white">{symbol[0]}</span>
		</div>
	);
};

export default CoinIcon;
