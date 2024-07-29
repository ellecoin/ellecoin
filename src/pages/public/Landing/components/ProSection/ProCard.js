import { Typography, List } from 'antd';
import iconsPricing from '../../../../../assets/icons/pricing/index';

const { Title, Text, Link } = Typography;

const ProCard = ({ info, t, benefits }) => (
	<div className="pro-list">
		<Title className="pro-deck" level={4} style={{ marginTop: '16px' }}>
			{t('User and Devices')}
		</Title>
		<List
			size="small"
			dataSource={info}
			renderItem={(item) => (
				<List.Item>
					<div className="pro-item">
						<span>{iconsPricing.check}</span>
						<Text className="pro-info">
							{t(item.text)} {item.link && <Link href={item.link.url}>{t(item.link.text)}</Link>}
						</Text>
					</div>
				</List.Item>
			)}
		/>
		<Title level={4} className="pro-deck" style={{ marginTop: '50px' }}>
			Features
		</Title>
		<List
			size="small"
			dataSource={benefits}
			renderItem={(item) => (
				<List.Item>
					<div className="pro-item">
						<span>{iconsPricing.check}</span>
						<Text className="pro-info">{t(item.text)}</Text>
					</div>
				</List.Item>
			)}
		/>
	</div>
);

export default ProCard;
