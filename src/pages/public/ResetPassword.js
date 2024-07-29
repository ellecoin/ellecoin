import React, { useMemo, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Form, Input, Button, notification, Layout, theme } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

import userService from '../../services/UserService';
import Footer from '../../components/footer/Footer';
import LanguageDropdown from '../../components/header/component/LanguageDropdown';
import backgroundImage from '../../assets/images/background-image.png';
// import ThemeSelect from '../../components/header/component/ThemeSelect';
import { useStore } from '../../context/AppContext';
import { useLayoutContext } from '../../context/LayoutContext';

const { useToken } = theme;

const ResetPassword = withTranslation()(
	observer(({ t }) => {
		const { search } = useLocation();
		const { stateStore } = useStore();
		const history = useHistory();
		const [loading, setLoading] = useState(false);
		const [errors, setErrors] = useState({});
		const query = useMemo(() => new URLSearchParams(search), [search]);
		const { token } = useToken();
		const [form] = Form.useForm();
		const { onChangeModalConfigs } = useLayoutContext();

		useEffect(() => {
			if (!query.get('token') || !query.get('uid')) {
				history.replace('/login');
			}
		}, []);

		const onSubmit = async ({ new_password, confirm_password }) => {
			setLoading(true);
			userService
				.resetPassword({
					new_password,
					confirm_password,
					token: query.get('token'),
					uid: query.get('uid'),
				})
				.then(({ message }) => {
					notification.success({
						message,
					});
					history.push('/login');
				})
				.catch(({ errors }) => {
					if (errors) {
						setErrors(errors);
					}
					onChangeModalConfigs({
						open: true,
						title: t('error'),
						children: errors?.message,
						type: 'error',
					});
				})
				.finally(() => setLoading(false));
		};

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
			<Layout className="h-screen" style={{ color: token.colorTextBase }}>
				<div className="h-full grid grid-cols-12">
					<div
						className="bg-cover h-full w-full bg-no-repeat bg-center hidden md:block md:col-span-6"
						style={{ backgroundImage: `url(${backgroundImage})` }}
					/>

					<div className="md:px-[70px] md:py-[30px] p-[30px] col-span-12 md:col-span-6 h-full flex flex-col gap-4">
						<div className="flex justify-end items-center justify-items-center space-x-6">
							<LanguageDropdown />
							{/* <ThemeSelect /> */}
						</div>
						<div className="flex-1 w-full flex justify-center items-center">
							<div className=" w-full card-primary py-[32px] md:px-[48px] max-w-[539px]">
								<div className="max-w-[539px]">
									<p className="text-center text-primary text-[20px] font-bold">
										{t('reset_password')}
									</p>
									<p className="text-center mt-[44px] mb-[14px] text-secondary text-[16px] font-normal">
										{t('That’s okey, it happens! Please enter new your password.')}
									</p>
									<Form
										form={form}
										onFinish={(values) => onSubmit(values)}
										onValuesChange={() => setErrors({})}
									>
										<div className="form-group">
											<p className="text-secondary text-[16px] font-normal mb-[12px]">
												{t('password')}
											</p>
											<Form.Item
												name="new_password"
												rules={[
													{
														required: true,
														message: t('pass_warning'),
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
												<Input.Password
													placeholder="************"
													data-qa="reset-password-input"
												/>
											</Form.Item>
										</div>

										<div className="form-group">
											<p className="text-secondary text-[16px] font-normal mb-[12px]">
												{t('repeat_password')}
											</p>
											<Form.Item
												name="confirm_password"
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
															return Promise.reject(
																new Error(t('confirm_pass_not_match'))
															);
														},
													}),
												]}
												validateStatus={errors.confirm_password ? 'error' : undefined}
												help={errors.confirm_password}
											>
												<Input.Password
													placeholder="************"
													data-qa="reset-password-repeat-input"
												/>
											</Form.Item>
										</div>

										<div className="flex flex-col items-center mt-[38px]">
											<Form.Item>
												<Button
													className="button-primary h-[65px] w-[240px] rounded-full"
													type="primary"
													htmlType="submit"
													loading={loading}
													data-qa="reset-password-button"
												>
													{t('change')}
												</Button>
											</Form.Item>
										</div>
									</Form>
								</div>
							</div>
						</div>
						<div className="text-center">
							<Footer />
						</div>
					</div>
				</div>
			</Layout>
		);
	})
);

export default ResetPassword;
