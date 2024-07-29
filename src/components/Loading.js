import { Spin } from 'antd';
import { Loading3QuartersOutlined } from '@ant-design/icons';

const Loading = ({ className, ...props }) => (
	<Spin indicator={<Loading3QuartersOutlined className={`${className} text-primary`} spin />} {...props} />
);

export default Loading;
