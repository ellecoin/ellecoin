import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { themeObject } from '../../styles/themes/themeVariables';

const SyncDataIcon = ({ width = 18, height = 18, className }) => {
	const { typeTheme } = useContext(ThemeContext);

	return (
		<svg
			className={className}
			width={width}
			height={height}
			viewBox="0 0 18 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M17 7.99971C16.7554 6.23992 15.9391 4.60937 14.6766 3.3592C13.4142 2.10904 11.7758 1.30862 10.0137 1.08126C8.25159 0.853893 6.46362 1.21219 4.9252 2.10095M1 1.99971V5.99971H5"
				stroke={themeObject[typeTheme].syncIconHomePage}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1 10C1.24456 11.7598 2.06093 13.3903 3.32336 14.6405C4.58579 15.8907 6.22424 16.6911 7.98633 16.9184C9.74841 17.1458 11.5364 16.7875 13.0748 15.8988M17 16V12H13"
				stroke={themeObject[typeTheme].syncIconHomePage}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default SyncDataIcon;
