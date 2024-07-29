import styled from 'styled-components';
import { Typography } from 'antd';
import { useContext } from 'react';
import { Text } from '../../../../components';
import { ThemeContext } from '../../../../context/ThemeContext';

export const BotStatusLabel = styled(Text)`
	min-width: 100px;
	padding: 4px;
	border-radius: 6px;
	text-align: center;
	color: #fff;
`;

export const ExchangeButton = (props) => {
	const { typeTheme } = useContext(ThemeContext);

	return (
		<StyledExchangeButton style={{ backgroundColor: typeTheme === 'light' ? '#F6F8FB' : '#151619' }} {...props} />
	);
};

const StyledExchangeButton = styled(Typography)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px 4px;
	min-width: 97px;
	border-radius: 6px;
	white-space: nowrap;
	border: 1px solid #2f324140;
	text-align: center;
`;
