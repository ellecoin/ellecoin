import { Button, ConfigProvider, Form, Input, Modal } from 'antd';
import { withTranslation } from 'react-i18next';
import React, { useContext, useState } from 'react';
import userService from '../../../../services/UserService';
import { useStore } from '../../../../context/AppContext';
import { themeObject } from '../../../../styles/themes/themeVariables';
import { ThemeContext } from '../../../../context/ThemeContext';
import { useLayoutContext } from '../../../../context/LayoutContext';

const ChangePasswordModal = ({ t, open, onClose }) => {
	const { tokenStore } = useStore();
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const { typeTheme } = useContext(ThemeContext);
	const { onChangeModalConfigs } = useLayoutContext();

	const themeConfig = {
		components: {
			token: {
				colorBgLayout: themeObject[typeTheme].background,
			},
			Input: {
				controlHeight: 40,
				fontSize: 16,
				colorBorder: themeObject[typeTheme].borderColor,
				borderRadius: 8,
			},
			Button: {
				borderRadius: 8,
				controlHeight: 40,
			},
		},
	};
	return (
		<ConfigProvider theme={themeConfig}>
			<Modal
				destroyOnClose
				title={t('change_password')}
				open={open}
				footer={null}
				onCancel={() => {
					onClose?.();
				}}
			>
				<Form
					className="mt-4"
					onValuesChange={() => setErrors({})}
					onFinish={(values) => {
						setLoading(true);
						userService
							.changePassword(
								values.old_password,
								values.new_password,
								values.confirm_password,
								tokenStore.refreshToken
							)
							.then((res) => {
								onClose?.();
								onChangeModalConfigs({
									open: 'true',
									type: 'success',
									title: t('update_successful'),
									children: t('update_password_success'),
								});
							})
							.catch(({ errors }) => {
								if (errors) {
									setErrors(errors);
								} else {
									onClose?.();
									onChangeModalConfigs({
										open: 'true',
										type: 'error',
										children: t('update_password_fail'),
										title: t('error'),
									});
								}
							})
							.finally(() => setLoading(false));
					}}
				>
					<div>
						<div className="mb-2">{t('old_password')}</div>
						<Form.Item
							name="old_password"
							className="md:col-span-3"
							rules={[
								{
									required: true,
									message: t('old_pass_warning'),
								},
							]}
							validateStatus={errors.old_password ? 'error' : undefined}
							help={errors.old_password}
						>
							<Input.Password />
						</Form.Item>
					</div>
					<div>
						<div className="mb-2">{t('new_password')}</div>
						<Form.Item
							name="new_password"
							className="md:col-span-3"
							rules={[
								{
									required: true,
									message: t('new_pass_warning'),
								},
								{
									min: 8,
									message: t('pass_too_short'),
								},
								{
									pattern: /(?=.*?[A-Z]).*/,
									message: t('Password must contain at least 1 uppercase'),
								},
								{
									pattern: /(?=.*[!@#$%^&*])/,
									message: t('Password must contain special character'),
								},
								{
									pattern: /(?=.*?[0-9]).*/,
									message: t('Password must contain at least one number'),
								},
							]}
							validateStatus={errors.new_password ? 'error' : undefined}
							help={errors.new_password}
						>
							<Input.Password />
						</Form.Item>
					</div>
					<div>
						<div className="mb-2">{t('confirm')}</div>
						<Form.Item
							name="confirm_password"
							className="md:col-span-3"
							rules={[
								{
									required: true,
									message: t('confirm_pass_warning'),
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue('new_password') === value) {
											return Promise.resolve();
										}
										return Promise.reject(new Error(t('confirm_pass_not_match')));
									},
								}),
							]}
							validateStatus={errors.confirm_password ? 'error' : undefined}
							help={errors.confirm_password}
						>
							<Input.Password />
						</Form.Item>
					</div>
					<div className="text-right mt-2 flex justify-end gap-2">
						<Button className="button-primary-outline--default" onClick={() => onClose?.()}>
							{t('cancel')}
						</Button>
						<Button type="primary" htmlType="submit" loading={loading} className="button-primary">
							{t('update')}
						</Button>
					</div>
				</Form>
			</Modal>
		</ConfigProvider>
	);
};

export default withTranslation()(ChangePasswordModal);
