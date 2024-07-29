import { useContext, useState } from 'react';
import styled from 'styled-components';
import { themeObject } from '../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../context/ThemeContext';

const PenIconContainer = styled.div`
	.svg-insider path {
		fill: ${({ hovered, typeTheme, noEffect }) =>
			noEffect ? '' : hovered ? '#FF8413' : themeObject[typeTheme].colorIconExchange};
		transition: fill 0.2s;
	}

	.svg-insider {
		transition: transform 0.2s;
	}

	&:hover .svg-insider {
		transform: ${({ noEffect }) => (!noEffect ? 'scale(1.3)' : 'none')};
	}
`;

const PenIcon = ({ width = 17, height = 18, fill, noEffect }) => {
	const { typeTheme } = useContext(ThemeContext);
	const [hovered, setHovered] = useState(false);

	return (
		<PenIconContainer hovered={hovered} typeTheme={typeTheme} noEffect={noEffect}>
			<div className="svg-contaier" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
				<svg
					className="svg-insider"
					width={width}
					height={height}
					viewBox="0 0 16 16"
					fill={fill}
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M5.47968 14.6899L12.8017 5.2212C13.1996 4.71059 13.3411 4.12025 13.2084 3.51916C13.0935 2.97271 12.7575 2.45314 12.2534 2.05899L11.0242 1.08255C9.95423 0.231533 8.62778 0.321114 7.86729 1.29755L7.04489 2.36446C6.93877 2.49793 6.9653 2.69501 7.09795 2.80251C7.09795 2.80251 9.17605 4.46872 9.22026 4.50455C9.36175 4.63892 9.46786 4.81808 9.49439 5.03308C9.53861 5.45411 9.24679 5.84827 8.81348 5.90201C8.6101 5.92889 8.41555 5.86618 8.27406 5.74973L6.08985 4.01185C5.98373 3.93213 5.82456 3.94915 5.73613 4.05664L0.545298 10.7752C0.209264 11.1963 0.0943056 11.7427 0.209264 12.2712L0.872488 15.1468C0.90786 15.2991 1.0405 15.4066 1.19968 15.4066L4.11786 15.3707C4.64844 15.3618 5.14365 15.1199 5.47968 14.6899ZM9.56576 13.7944H14.3242C14.7884 13.7944 15.166 14.1769 15.166 14.6472C15.166 15.1184 14.7884 15.5 14.3242 15.5H9.56576C9.1015 15.5 8.7239 15.1184 8.7239 14.6472C8.7239 14.1769 9.1015 13.7944 9.56576 13.7944Z"
						fill={themeObject[typeTheme].colorIconExchange}
					/>
				</svg>
			</div>
		</PenIconContainer>
	);
};

export default PenIcon;
