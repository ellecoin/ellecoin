import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ViewDetailIcon = ({ width = 16, height = 16, color, className }) => {
	const { typeTheme } = useContext(ThemeContext);

	const finalColor = color || (typeTheme === 'light' ? '#5D6589' : '#FFF');

	return (
		<svg width={width} height={height} fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.20667 1.33325H10.794C12.8533 1.33325 14 2.51992 14 4.55325V11.4399C14 13.5066 12.8533 14.6666 10.794 14.6666H5.20667C3.18 14.6666 2 13.5066 2 11.4399V4.55325C2 2.51992 3.18 1.33325 5.20667 1.33325ZM5.38667 4.43992V4.43325H7.37933C7.66667 4.43325 7.9 4.66659 7.9 4.95259C7.9 5.24659 7.66667 5.47992 7.37933 5.47992H5.38667C5.09933 5.47992 4.86667 5.24659 4.86667 4.95992C4.86667 4.67325 5.09933 4.43992 5.38667 4.43992ZM5.38667 8.49325H10.6133C10.9 8.49325 11.1333 8.25992 11.1333 7.97325C11.1333 7.68659 10.9 7.45259 10.6133 7.45259H5.38667C5.09933 7.45259 4.86667 7.68659 4.86667 7.97325C4.86667 8.25992 5.09933 8.49325 5.38667 8.49325ZM5.38667 11.5399H10.6133C10.8793 11.5133 11.08 11.2859 11.08 11.0199C11.08 10.7466 10.8793 10.5199 10.6133 10.4933H5.38667C5.18667 10.4733 4.99333 10.5666 4.88667 10.7399C4.78 10.9066 4.78 11.1266 4.88667 11.2999C4.99333 11.4666 5.18667 11.5666 5.38667 11.5399Z"
				fill={finalColor}
			/>
		</svg>
	);
};

const ViewDetailNoFillIcon = ({ width = 28, height = 33, color, className }) => {
	const { typeTheme } = useContext(ThemeContext);

	const finalColor = color || (typeTheme === 'light' ? '#5D6589' : '#FFF');

	return (
		<svg width={width} height={height} fill="none" viewBox="0 0 28 33" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M18.563 1.60308H7.47467C4.00801 1.58974 1.16634 4.35308 1.08467 7.81808V25.6731C1.00801 29.1947 3.79967 32.1131 7.32134 32.1914C7.37301 32.1914 7.42301 32.1931 7.47467 32.1914H20.7897C24.2797 32.0497 27.0297 29.1664 27.0047 25.6731V10.3964L18.563 1.60308Z"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M18.1251 1.58337V6.43171C18.1251 8.79837 20.0385 10.7167 22.4051 10.7234H26.9968"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M17.8135 22.5975H8.81348"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M14.4053 16.3433H8.81201"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export { ViewDetailIcon, ViewDetailNoFillIcon };
