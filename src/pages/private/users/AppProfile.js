import React, { useState, useEffect, useContext, useMemo } from 'react';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Form, Upload, Input, Modal, Button, Avatar, Divider, ConfigProvider } from 'antd';
import { useHistory } from 'react-router-dom';

import { useStore } from '../../../context/AppContext';
import userService from '../../../services/UserService';
import Image from '../../../components/Image';
import PhoneNumberInput from '../../../components/input/PhoneNumberInput';
import TerminateAccountModal from './components/TerminateAccountModal';
import { ThemeContext } from '../../../context/ThemeContext';
import { themeObject } from '../../../styles/themes/themeVariables';
import Settings from './components/Settings';

const AppProfile = ({ t }) => {
	const history = useHistory();
	const { authStore, stateStore } = useStore();
	const [editingPersonalData, setEditingPersonalData] = useState(false);
	const [errors, setErrors] = useState({});
	const [showTerminatePopup, setShowTerminatePopup] = useState(false);
	const { typeTheme } = useContext(ThemeContext);
	const [form] = Form.useForm();

	const themeConfig = useMemo(
		() => ({
			components: {
				Input: {
					controlHeight: 60,
					fontSize: 16,
				},
				Select: {
					controlHeight: 60,
					fontSize: 16,
				},
				Checkbox: {
					borderRadius: 4,
					controlHeight: 20,
					controlInteractiveSize: 20,
					colorPrimary: themeObject[typeTheme].colorRadioPrimary,
					colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
				},
				Switch: {
					controlHeight: 24,
					colorPrimary: themeObject[typeTheme].colorRadioPrimary,
					colorPrimaryHover: themeObject[typeTheme].colorRadioPrimary,
					colorTextBase: themeObject[typeTheme].colorRadioPrimary,
				},
			},
		}),
		[typeTheme]
	);

	useEffect(() => {
		const errorFields = form.getFieldsError().reduce((arr, field) => {
			if (field.errors.length) {
				arr.push(field.name);
			}
			return arr;
		}, []);
		form.validateFields(errorFields);
	}, [stateStore.language]);

	return (
		<div className="px-4 md:px-8">
			<ConfigProvider theme={themeConfig}>
				<div className="space-y-4">
					<div className="card-primary p-0">
						<div className="flex flex-col md:flex-row justify-between gap-2 w-full p-4">
							<div className="flex items-center gap-4">
								<Avatar
									style={{ border: 'none' }}
									className="flex-none"
									size={64}
									src={authStore.user?.avatar?.thumb_image_url}
								/>
								<div className="flex flex-col flex-1">
									<p className="text-primary text-[18px] font-semibold">
										{authStore.user?.user_name}
									</p>
									<p className="text-secondary text-[14px]">{authStore.user?.email}</p>
								</div>
							</div>
							<div className="inline-flex gap-2">
								<Upload
									showUploadList={false}
									beforeUpload={(file) => {
										userService.updateAvatar(file).then(({ avatar }) => {
											authStore.updateUser({ avatar });
										});
										return false;
									}}
									className="w-full md:w-auto"
								>
									<Button className="button-primary h-[48px] text-[14px] w-full md:w-auto font-semibold">
										{t('Change Photo Profile')}
									</Button>
								</Upload>
							</div>
						</div>
						<Divider className="m-0" />
						<div className="p-4">
							<Form
								form={form}
								initialValues={{
									email: authStore.user.email,
								}}
							>
								<div>
									<p className="mb-[8px] font-normal text-secondary text-[16px]">{`${t('email')}`}</p>
									<Form.Item
										className="mb-[8px]"
										name="email"
										rules={[
											{ required: true, message: t('input_your_email') },
											{
												pattern:
													/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
												message: t('email_invalid'),
											},
										]}
										validateStatus={errors.email ? 'error' : undefined}
										help={errors.email}
									>
										<Input
											disabled
											placeholder="hello@example.com"
											data-qa="register-email-input"
											prefix={
												<Image
													className="rounded-none mr-2"
													src={`/images/sign-up/email${
														typeTheme === 'light' ? '-light' : ''
													}.svg`}
													alt="imageAlt"
												/>
											}
										/>
									</Form.Item>
								</div>
							</Form>
						</div>
						<Divider className="m-0 mt-4" />
					</div>

					<Settings />

					<div className="card-primary grid grid-cols-1 md:grid-cols-2 md:gap-2 gap-8">
						<div className="col-span-1">
							<p className="text-primary text-[16px] font-semibold">{t('Advanced settings')}</p>
							<p className="text-secondary font-normal text-[14px]">
								{t('Do you want to terminate your account?')}
							</p>
						</div>
						<div className="col-span-1 flex items-start justify-center md:justify-end">
							<Button
								className="button-primary--danger w-full md:w-auto"
								type="primary"
								onClick={() => {
									setShowTerminatePopup(true);
								}}
							>
								{t('Terminate account')}
							</Button>
						</div>
					</div>
					{showTerminatePopup && (
						<TerminateAccountModal
							open={showTerminatePopup}
							onClose={() => setShowTerminatePopup(false)}
							onDeleted={() => {
								setShowTerminatePopup(false);
								Modal.info({
									title: t('Your account have been terminated.'),
									onOk: () => {
										authStore.logout();
										history.push('/login');
									},
								});
							}}
						/>
					)}
				</div>
			</ConfigProvider>
		</div>
	);
};

export default withTranslation()(observer(AppProfile));
