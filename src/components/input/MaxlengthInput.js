import { Input } from 'antd';
import React from 'react';

const MaxLengthInput = ({ value, length = 0, ...props }) => (
	<Input
		value={value}
		{...props}
		suffix={
			<span className="opacity-60">
				{value?.length || 0}/{length}
			</span>
		}
	/>
);

export default MaxLengthInput;
