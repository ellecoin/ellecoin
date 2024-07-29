import { Typography } from 'antd';
import styled from 'styled-components';
import { Link as LinkLib } from 'react-router-dom';

const { Text: TextLib } = Typography;

export const ErrorText = (props) => <TextLib type="danger" {...props} className={`text-xs ${props?.className}`} />;

export const Text = (props) => <TextLib {...props} className={`text-[14px] ${props?.className}`} />;

export const LgText = (props) => <TextLib {...props} className={`text-[18px] ${props?.className}`} />;

export const Link = styled(LinkLib)`
	font-size: 14px;
	text-decoration: underline !important;
	color: #2180f8;
`;
