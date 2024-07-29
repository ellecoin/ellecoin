import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, ConfigProvider, Form, Input, Layout } from 'antd';
import { withTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext';
import LanguageDropdown from '../../components/header/component/LanguageDropdown';
// import ThemeSelect from '../../components/header/component/ThemeSelect';
import backgroundImage from '../../assets/images/background-image.png';
import Image from '../../components/Image';
import { useResponsive } from '../../hooks/useResponsive';
import { themeObject } from '../../styles/themes/themeVariables';
import { FONT_FAMILY } from '../../styles/themes/constants';
import userService from '../../services/UserService';
import { useStore } from '../../context/AppContext';
import Footer from '../../components/footer/Footer';
import ActiveAccount from './ActiveAccount';

const Login = withTranslation()(({ t }) => {
	const { tokenStore, stateStore } = useStore();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [email, setEmail] = useState(null);
	const { typeTheme } = useContext(ThemeContext);
	const [errors, setErrors] = useState({});
	const [form] = Form.useForm();
	const { mobileOnly } = useResponsive();

	useEffect(() => {
		const errorFields = form.getFieldsError().reduce((arr, field) => {
			if (field.errors.length) {
				arr.push(field.name);
			}
			return arr;
		}, []);
		form.validateFields(errorFields);
	}, [stateStore.language]);

	const themeConfig = useMemo(
		() => ({
			token: {
				// Color
				colorPrimary: themeObject[typeTheme].primary,
				colorError: themeObject[typeTheme].error,
				colorInfo: themeObject[typeTheme].primary,
				colorSuccess: themeObject[typeTheme].success,
				colorWarning: themeObject[typeTheme].warning,
				colorTextBase: themeObject[typeTheme].colorTextBase,
				colorBgBase: themeObject[typeTheme].background,

				// Font
				fontFamily: FONT_FAMILY.main,
				fontSize: 16,
				fontWeight: 400,
				// Radius
				borderRadius: 12,
				// Size
				sizeUnit: 4,
				sizeStep: 4,
				sizePopupArrow: 16,
				// Control Base
				// controlHeight: 60,

				// map token
				colorBgLayout: themeObject[typeTheme].background,
				colorBgElevated: themeObject[typeTheme].backgroundElevated,
				colorTextSecondary: themeObject[typeTheme].colorTextBase,

				// alias token
				controlItemBgActive: themeObject[typeTheme].backgroundActivate,
				colorLink: themeObject[typeTheme].colorLinkPrimary,
				colorLinkActive: themeObject[typeTheme].colorLinkPrimary,
				colorLinkHover: themeObject[typeTheme].colorLinkPrimary,
			},
			components: {
				Input: {
					controlHeight: 60,
					borderRadius: 60,
					boxShadow: themeObject[typeTheme].inputBoxShadow,
					controlOutline: themeObject[typeTheme].inputBoxShadow,
					colorErrorOutline: themeObject[typeTheme].inputBoxShadow,
					colorErrorBorderHover: themeObject[typeTheme].inputBoxShadow,
					colorErrorHover: themeObject[typeTheme].inputBoxShadow,
					colorBgContainer: themeObject[typeTheme].inputBg,
					controlItemBgActive: themeObject[typeTheme].backgroundActivate,
					colorTextPlaceholder: themeObject[typeTheme].colorTextPlaceholder,
					colorBorder: themeObject[typeTheme].borderColor,
					colorBorderSecondary: themeObject[typeTheme].borderColor,
					colorPrimaryBorder: themeObject[typeTheme].borderColor,
				},
				Checkbox: {
					colorPrimary: themeObject[typeTheme].secondary,
					colorPrimaryHover: themeObject[typeTheme].secondary,
					colorPrimaryActive: themeObject[typeTheme].secondary,
					borderRadius: 4,
					controlHeight: 16,
					controlInteractiveSize: 16,
					colorBorder: '#A5ADCF',
				},
				Divider: {
					colorSplit: themeObject[typeTheme].colorDivide,
				},
			},
		}),
		[typeTheme]
	);

	const submitHandler = (values) => {
		const { username, password } = values;
		setError(null);
		setLoading(true);
		userService
			.login(username, password)
			.then(({ access, refresh }) => {
				tokenStore.setToken(access);
				tokenStore.setRefreshToken(refresh);
				history.replace('/');
			})
			.catch(({ errors }) => {
				const { code, message, email } = errors;
				if (code !== 'username_password_incorrect') {
					setOpenModal(true);
					setEmail(email);
				} else {
					setError(message);
				}
			})
			.finally(() => setLoading(false));
	};

	return (
		<ConfigProvider theme={themeConfig}>
			<Layout className="h-screen">
				<div className="h-full grid grid-cols-12">
					<div
						className="bg-cover h-full w-full bg-no-repeat bg-center hidden md:block md:col-span-6"
						style={{ backgroundImage: `url(${backgroundImage})` }}
					/>

					<div className="md:px-[70px] md:py-[30px] p-[16px] col-span-12 md:col-span-6 h-full flex flex-col gap-4">
						<div className="flex justify-end items-center mb-[80px] space-x-4">
							<LanguageDropdown />
							{/* <ThemeSelect /> */}
						</div>
						<div className="flex justify-center items-center flex-1">
							<div className={`${!mobileOnly ? 'card-primary' : ''} p-[16px] md:p-[48px] w-[478px]`}>
								<div className="w-[70%] mb-4 mx-auto flex justify-center">
									<Image src="/images/logo.png" alt="Logo" />
								</div>
								<p
									className={`${
										typeTheme === 'light' ? 'text-[#000]' : 'text-[#fff]'
									} text-center mb-[44px] text-[16px]`}
								>
									{t('sign_in_your_account')}
								</p>
								<Form onFinish={submitHandler} form={form} onValuesChange={() => setErrors({})}>
									<Form.Item
										name="username"
										rules={[
											{
												required: true,
												message: t('email_warning'),
											},
										]}
										validateStatus={errors.username ? 'error' : undefined}
										help={errors.username}
									>
										<Input
											prefix={
												<Image
													className="rounded-none mr-2"
													src={`/images/sign-up/username${
														typeTheme === 'light' ? '-light' : ''
													}.svg`}
													alt="imageAlt"
												/>
											}
											placeholder={t('input_your_username')}
											data-qa="username-input"
										/>
									</Form.Item>

									<Form.Item
										name="password"
										rules={[
											{
												required: true,
												message: t('password_warning'),
											},
										]}
										validateStatus={errors.password ? 'error' : undefined}
										help={errors.password}
									>
										<Input.Password
											prefix={
												<Image
													className="rounded-none mr-2"
													src={`/images/sign-up/password${
														typeTheme === 'light' ? '-light' : ''
													}.svg`}
													alt="imageAlt"
												/>
											}
											data-qa="password-input"
											placeholder={t('input_your_password')}
										/>
									</Form.Item>

									{error && (
										<div className="form-row d-flex justify-content-between mt-4 mb-2">
											<p className="text-[red]">{error}</p>
										</div>
									)}

									<div className="flex justify-between items-center px-[17px]">
										<Checkbox>
											<span
												className={`${
													!mobileOnly
														? 'text-[14px] leading-[22px]'
														: 'text-[13px] leading-[20px]'
												} text-secondary text-[#58667E]`}
											>
												{t('Remember my preference')}
											</span>
										</Checkbox>
										<a
											href="/forgot-password"
											className={`${
												!mobileOnly
													? 'text-[14px] leading-[22px]'
													: 'text-[13px] leading-[20px]'
											} underline text-secondary text-[#58667E] text-right`}
											data-qa="forgot-password-link"
										>
											{t('forgot_your_password')}
										</a>
									</div>
									<Form.Item className="mb-0 mt-[45px]">
										<Button
											className="button-primary h-[52px] w-full font-semibold text-[16px] rounded-[60px] shadow-none"
											type="primary"
											htmlType="submit"
											loading={loading}
											data-qa="login-button"
										>
											{t('sign_me_in')}
										</Button>
									</Form.Item>
									<div className="text-center mt-4">
										<p className="text-secondary">
											{t('dont_have_an_account')}{' '}
											<a
												href="/sign-up"
												className="underline text-secondary text-[14px]"
												data-qa="sign-in-link"
											>
												{t('sign_up')}
											</a>
										</p>
									</div>
								</Form>
							</div>
						</div>
						<div className="text-center footer-primary">
							<Footer />
						</div>
					</div>
				</div>

				<ActiveAccount openModal={openModal} setOpenModal={() => setOpenModal(!openModal)} email={email} />
			</Layout>
		</ConfigProvider>
	);
});

export default Login;
