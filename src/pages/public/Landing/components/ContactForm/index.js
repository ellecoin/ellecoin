import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import iconsContact from '../../../../../assets/icons/contact/index';

const { TextArea } = Input;

const ContactForm = () => {
	const { t } = useTranslation();

	const onFinish = (values) => {
		console.log('Received values from form: ', values);
	};

	return (
		<Form onFinish={onFinish} layout="vertical" className="contact-form">
			<Row gutter={16}>
				<Col xs={24} sm={12}>
					<Form.Item
						className="contact-item"
						name="name"
						rules={[{ required: true, message: 'Please input your first name!' }]}
					>
						<Input placeholder="Your Name" prefix={<div>{iconsContact.name}</div>} />
					</Form.Item>
				</Col>
				<Col xs={24} sm={12}>
					<Form.Item name="message" rules={[{ required: true, message: 'Please input your message!' }]}>
						<TextArea placeholder="Message" rows={1} />
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col xs={24} sm={12}>
					<Form.Item
						className="contact-item"
						name="email"
						rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
					>
						<Input placeholder="Your email" prefix={<div>{iconsContact.email}</div>} />
					</Form.Item>
				</Col>
			</Row>

			<Row>
				<Col xs={24} sm={12}>
					<Form.Item
						className="contact-item"
						name="subject"
						rules={[{ required: true, message: 'Please input your subject!' }]}
					>
						<Input placeholder="Subject" prefix={<div>{iconsContact.subject}</div>} />
					</Form.Item>
				</Col>
				<Col xs={24} sm={12} style={{ display: 'flex', alignItems: 'center' }}>
					<Button type="primary" htmlType="submit" className="contact-btn">
						{t('Send')}
						<span className="contact-btn-icon"> {iconsContact.arrow_right}</span>
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default ContactForm;
