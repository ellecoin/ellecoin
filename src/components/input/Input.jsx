import { Input as InputLib } from 'antd';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledInput = styled.div`
	& .input-error {
		outline: none;
		border: 1px solid #fa2256;
	}
	& p {
		color: #fa2256;
		font-size: 14px;
	}
`;

export const Input = withTranslation()(({ t, i18n, ...props }) => {
	const { errorMsg, error, className = '' } = props;
	return (
		<StyledInput>
			<InputLib {...props} className={`${error ? 'input-error' : ''} ${className}`} />
			<br />
			{error && <p>{errorMsg}</p>}
		</StyledInput>
	);
});
