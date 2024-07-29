import { useContext, useState } from 'react';
import styled from 'styled-components';
import { themeObject } from '../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../context/ThemeContext';

const DeleteIconContainer = styled.div`
	.svg-insider path {
		fill: ${({ hovered, typeTheme, noEffect }) =>
			noEffect ? '' : hovered ? '#FA2256' : themeObject[typeTheme].colorIconExchange};
		transition: fill 0.2s;
	}

	.svg-insider {
		transition: transform 0.2s;
	}

	&:hover .svg-insider {
		transform: ${({ noEffect }) => (!noEffect ? 'scale(1.3)' : 'none')};
	}
`;

const DeleteIcon = ({ width = 17, height = 18, fill, noEffect }) => {
	const { typeTheme } = useContext(ThemeContext);
	const [hovered, setHovered] = useState(false);

	return (
		<DeleteIconContainer hovered={hovered} typeTheme={typeTheme} noEffect={noEffect}>
			<div className="svg-contaier" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
				<svg
					className="svg-insider"
					width={width}
					height={height}
					viewBox="0 0 16 18"
					fill={fill}
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M14.5719 3.36849C14.8961 3.36849 15.166 3.63765 15.166 3.98015V4.29681C15.166 4.63098 14.8961 4.90847 14.5719 4.90847H0.760894C0.435899 4.90847 0.166016 4.63098 0.166016 4.29681V3.98015C0.166016 3.63765 0.435899 3.36849 0.760894 3.36849H3.19065C3.68422 3.36849 4.11377 3.01766 4.2248 2.52266L4.35204 1.95434C4.5498 1.18018 5.2006 0.666016 5.94541 0.666016H9.38662C10.1233 0.666016 10.7814 1.18018 10.9719 1.9135L11.108 2.52183C11.2183 3.01766 11.6478 3.36849 12.1422 3.36849H14.5719ZM13.3375 14.9444C13.5912 12.5802 14.0353 6.96362 14.0353 6.90695C14.0516 6.73529 13.9956 6.57279 13.8846 6.44196C13.7655 6.31946 13.6147 6.24696 13.4486 6.24696H1.88978C1.72283 6.24696 1.56398 6.31946 1.45376 6.44196C1.34191 6.57279 1.2868 6.73529 1.29491 6.90695C1.2964 6.91737 1.31233 7.11521 1.33897 7.44597C1.45733 8.91534 1.78699 13.0078 2.00001 14.9444C2.15075 16.371 3.08683 17.2677 4.44273 17.3002C5.48904 17.3244 6.56695 17.3327 7.66918 17.3327C8.70738 17.3327 9.76179 17.3244 10.8405 17.3002C12.2434 17.276 13.1787 16.3952 13.3375 14.9444Z"
						fill={themeObject[typeTheme].colorIconExchange}
					/>
				</svg>
			</div>
		</DeleteIconContainer>
	);
};

export default DeleteIcon;
