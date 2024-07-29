import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const StopIcon = ({ width = 20, height = 20, color, className }) => {
	const { typeTheme } = useContext(ThemeContext);

	const finalColor = color || (typeTheme === 'light' ? '#5D6589' : '#FFF');

	return (
		<svg fill={color} height={height} width={width} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_6006_4263)">
				<path
					d="M9.99262 2C14.3873 2.00188 17.981 5.60425 17.9777 10.0041C17.9745 14.4105 14.3777 18.0033 9.97317 18C5.58902 17.9967 1.99579 14.3897 2 9.99613C2.00422 5.59253 5.59699 1.99813 9.99262 2ZM16.9827 10.0022C16.9722 6.0781 13.8849 3.04894 10.0814 3.00183C6.16317 2.95332 3.00558 6.04271 2.99527 9.99215C2.98543 13.8579 6.08466 16.9743 9.91341 17.0019C13.7647 17.03 16.9701 14.0011 16.9827 10.0022Z"
					fill={finalColor}
				/>
				<path d="M6.99556 12.9932V7.01294H12.9784V12.9932H6.99556Z" fill={finalColor} />
			</g>
			<defs>
				<clipPath id="clip0_6006_4263">
					<rect width="15.9777" height="16" fill="white" transform="translate(2 2)" />
				</clipPath>
			</defs>
		</svg>
	);
};

export { StopIcon };
