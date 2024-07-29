import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const StartIcon = ({ width = 18, height = 18, color, className }) => {
	const { typeTheme } = useContext(ThemeContext);

	const finalColor = color || (typeTheme === 'light' ? '#5D6589' : '#FFF');

	return (
		<svg width={width} height={height} fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
			<g id="Component 36">
				<path
					id="Vector"
					d="M4.1665 6.16333C4.1665 4.581 5.917 3.62532 7.24802 4.48097L13.2162 8.31764C14.4408 9.10491 14.4408 10.8951 13.2162 11.6824L7.24802 15.519C5.917 16.3747 4.1665 15.419 4.1665 13.8367V6.16333Z"
					fill={finalColor}
				/>
			</g>
		</svg>
	);
};

export { StartIcon };
