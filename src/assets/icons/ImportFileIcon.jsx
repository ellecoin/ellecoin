import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ImportFileIcon = ({ width = 100, height = 100, color, className }) => {
	const { typeTheme } = useContext(ThemeContext);

	const finalColor = color || typeTheme === 'light' ? '#282B38' : '#FFF';

	return (
		<svg
			width={width}
			height={height}
			fill="none"
			className={className}
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M61.4025 11.5074H33.6859C25.0192 11.4741 17.9192 18.3783 17.7109 27.0449V71.7825C17.5234 80.5408 24.4734 87.7908 33.2275 87.9783C33.3817 87.9783 33.5359 87.9825 33.6859 87.9783H66.9692C75.6775 87.67 82.5609 80.495 82.5109 71.7825V33.4908L61.4025 11.5074Z"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M60.3121 11.4587V23.5796C60.3121 29.4962 65.0996 34.2921 71.0163 34.3087H82.4913"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M48.5038 41.2866V66.4575"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M58.2775 51.1012L48.5067 41.2887L38.7358 51.1012"
				stroke={finalColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export { ImportFileIcon };
