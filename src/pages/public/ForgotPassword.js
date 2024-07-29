import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Form, Input, Button, Layout, theme } from 'antd';
import { Link } from 'react-router-dom';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import userService from '../../services/UserService';
import Footer from '../../components/footer/Footer';
import { ThemeContext } from '../../context/ThemeContext';
import backgroundImage from '../../assets/images/background-image.png';
import Image from '../../components/Image';
import { useStore } from '../../context/AppContext';
// import ThemeSelect from '../../components/header/component/ThemeSelect';
import LanguageDropdown from '../../components/header/component/LanguageDropdown';

const { useToken } = theme;

const ForgotPassword = withTranslation()(
	observer(({ t }) => {
		const { typeTheme } = useContext(ThemeContext);
		const { stateStore } = useStore();
		const [loading, setLoading] = useState(false);
		const [sent, setSent] = useState(false);
		const { token } = useToken();
		const [errors, setErrors] = useState({});
		const [form] = Form.useForm();
		const isLGBigger = useMediaQuery('(min-width: 1024px)');

		useEffect(() => {
			const errorFields = form.getFieldsError().reduce((arr, field) => {
				if (field.errors.length) {
					arr.push(field.name);
				}
				return arr;
			}, []);
			form.validateFields(errorFields);
		}, [stateStore.language]);

		const onSubmit = ({ email }) => {
			setLoading(true);
			userService
				.forgotPassword(email)
				.then(({ message }) => {
					setSent(true);
				})
				.catch(({ errors }) => {
					if (errors) {
						setErrors(errors);
					}
				})
				.finally(() => setLoading(false));
		};
		return (
			<Layout className="h-screen" style={{ color: token.colorTextBase }}>
				<div className="h-full grid grid-cols-12">
					<div
						className="bg-cover h-full w-full bg-no-repeat bg-center hidden md:block md:col-span-6"
						style={{ backgroundImage: `url(${backgroundImage})` }}
					/>

					<div className="md:px-[70px] md:py-[30px] p-[16px] col-span-12 md:col-span-6 h-full flex flex-col gap-4">
						<div className="flex justify-end items-center justify-items-center space-x-4">
							<LanguageDropdown />
							{/* <ThemeSelect /> */}
						</div>
						<div className="flex-1 w-full flex justify-center items-center">
							<div
								className={`${
									isLGBigger ? 'card-primary' : ''
								} w-full py-[32px] md:px-[48px] max-w-[539px]`}
							>
								{sent ? (
									<div className="text-center">
										<p className="text-md text-primary mb-4">{t('sent_reset_password')}</p>
										<Link to="/login" className="flex justify-center">
											<Button
												className="px-8 py-2 button-primary h-[65px] rounded-full"
												type="primary"
											>
												{t('login_with_email')}
											</Button>
										</Link>
									</div>
								) : (
									<div className="max-w-[539px]">
										<p
											className={`${
												isLGBigger ? 'text-[20px]' : 'text-[16px]'
											} text-center text-primary  font-bold`}
										>
											{t('forgot_your_password')}
										</p>
										<p
											className={`${
												isLGBigger ? 'text-[16px] mt-[44px]' : 'text-[14px]  mt-[16px]'
											} text-center mb-[16px] text-secondary font-normal`}
										>
											{t('forgot_password_content')}
										</p>
										<Form form={form} onFinish={(e) => onSubmit(e)}>
											<div className="w-full">
												<div>
													<Form.Item
														name="email"
														rules={[
															{
																required: true,
																message: t('input_your_email'),
															},
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
															placeholder="hello@example.com"
															data-qa="forgot-password-email-input"
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
											</div>
											<div className="flex flex-col items-center">
												<Button
													type="primary"
													htmlType="submit"
													className={`${
														isLGBigger ? 'mt-[38px]' : 'mt-0'
													} button-primary h-[52px] w-[214px] rounded-[60px] text-[16px]`}
													loading={loading}
													data-qa="forgot-password-button"
												>
													{t('reset_password')}
												</Button>
											</div>
											<div className="text-center mt-[16px]">
												<p className="text-secondary">
													{t('already_have_an_account')}{' '}
													<Link className="underline" to="/login" data-qa="sign-in-link">
														{t('sign_in')}
													</Link>
												</p>
											</div>
										</Form>
									</div>
								)}
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

export default ForgotPassword;
