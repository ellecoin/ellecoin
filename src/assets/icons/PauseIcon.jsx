import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const PauseIcon = ({ width = 20, height = 20, color, className }) => {
	const { typeTheme } = useContext(ThemeContext);

	const finalColor = color || (typeTheme === 'light' ? '#5D6589' : '#FFF');

	return (
		<svg width={width} height={height} fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<rect x="4.05606" y="2.60498" width="4.94394" height="14.79" rx="2.47197" fill={finalColor} />
			<rect x="11" y="2.60498" width="4.94394" height="14.79" rx="2.47197" fill={finalColor} />
		</svg>
	);
};

export { PauseIcon };
