import { Radio } from 'antd';

const CustomFormRadioGroup = ({ children, value, onChange, onToggle, ...props }) => (
	<Radio.Group
		{...props}
		value={value}
		onChange={(e) => {
			onChange(e);
			onToggle(e.target.value);
		}}
	>
		{children}
	</Radio.Group>
);
export default CustomFormRadioGroup;
