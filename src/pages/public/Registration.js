import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Form, Input, Button, Checkbox, Layout, theme, ConfigProvider } from 'antd';
import { Trans, withTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';

import { useStore } from '../../context/AppContext';
import Footer from '../../components/footer/Footer';
import VerifyEmailView from '../../components/VerifyEmailView';

import userService from '../../services/UserService';
import PhoneNumberInput from '../../components/input/PhoneNumberInput';
// import ThemeSelect from '../../components/header/component/ThemeSelect';
import backgroundImage from '../../assets/images/background-image.png';
import Image from '../../components/Image';
import LanguageDropdown from '../../components/header/component/LanguageDropdown';
import { ThemeContext } from '../../context/ThemeContext';

const { useToken } = theme;

const Registration = withTranslation()(({ t }) => {
	const { stateStore } = useStore();
	const [registerSuccess, setRegisterSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState({});
	const [form] = Form.useForm();
	const { typeTheme } = useContext(ThemeContext);
	const { token } = useToken();

	useEffect(() => {
		const errorFields = form.getFieldsError().reduce((arr, field) => {
			if (field.errors.length) {
				arr.push(field.name);
			}
			return arr;
		}, []);
		form.validateFields(errorFields);
	}, [stateStore.language]);

	const submitHandler = ({ username, email, password, confirm_password, cpf, aai }) => {
		setSubmitting(true);
		userService
			.register({
				username,
				email,
				password,
				confirm_password,
				cpf: cpf || undefined,
				aai: aai || undefined,
				timezone: dayjs.tz.guess(),
			})
			.then((res) => setRegisterSuccess(true))
			.catch(({ errors }) => {
				if (errors) {
					setErrors(errors);
				}
			})
			.finally(() => setSubmitting(false));
	};

	const themeConfig = useMemo(
		() => ({
			components: {
				Checkbox: {
					borderRadius: 4,
					controlHeight: 16,
					controlInteractiveSize: 16,
					colorBorder: '#A5ADCF',
				},
			},
		}),
		[typeTheme]
	);

	const hidenRPF = useMemo(() => stateStore?.language !== 'pt', [stateStore?.language]);

	return (
		<ConfigProvider theme={themeConfig}>
			<Layout className="h-screen" style={{ color: token.colorTextBase }}>
				<div className="h-full grid grid-cols-12">
					<div
						className="bg-cover h-full w-full bg-no-repeat bg-center hidden md:block md:col-span-6"
						style={{ backgroundImage: `url(${backgroundImage})` }}
					/>

					<div className="md:px-[70px] p-[16px] 2xl:py-[15px] col-span-12 md:col-span-6 h-full flex flex-col gap-4">
						<div className="flex justify-end items-center mb-[80px] 2xl:mb-[10px] space-x-6">
							<LanguageDropdown />
							{/* <ThemeSelect /> */}
						</div>
						<div className="flex-1 w-full flex justify-center items-start">
							{registerSuccess ? (
								<VerifyEmailView
									className="w-full card-primary py-[32px] md:px-[48px] max-w-[539px] text-center"
									email={form.getFieldValue('email') || 'abc@gmail.com'}
								/>
							) : (
								<div className="w-full ">
									<div className="text-center mb-[30px] 2xl:mb-[17px] h-[40px] flex justify-center">
										<Image src="/images/logo.png" alt="Logo" />
									</div>
									<p className="text-center mb-[26px] text-secondary text-[16px]">
										{t('sign_up_your_account')}
									</p>
									<Form
										form={form}
										onFinish={(values) => submitHandler(values)}
										onValuesChange={() => setErrors({})}
									>
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
											<div>
												<Form.Item
													name="username"
													rules={[
														{
															required: true,
															message: t('input_your_username_required'),
														},
														{
															max: 150,
															message: t('username_too_long', { max: 150 }),
														},
														{
															pattern: /^[\w.@+-]+$/,
															message: t('username_invalid'),
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
														placeholder={t('input_username_placeholder')}
														data-qa="username-input"
													/>
												</Form.Item>
											</div>
											<div>
												<Form.Item
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
										</div>
										<div>
											<Form.Item
												name="password"
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
													data-qa="register-password-input"
													placeholder={t('input_password_register_placeholder')}
												/>
											</Form.Item>
										</div>
										<div>
											<Form.Item
												name="confirm_password"
												rules={[
													{
														required: true,
														message: t('confirm_pass_warning'),
													},
													({ getFieldValue }) => ({
														validator(_, value) {
															if (!value || getFieldValue('password') === value) {
																return Promise.resolve();
															}
															return Promise.reject(
																new Error(t('confirm_pass_not_match'))
															);
														},
													}),
												]}
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
													data-qa="register-password-repeat-input"
													placeholder={t('repeat_password')}
												/>
											</Form.Item>
										</div>

										{/* <div className={`grid grid-cols-1 lg:grid-cols-${hidenRPF ? 1 : 2} gap-x-4`}> */}
										{/*	<div> */}
										{/*		<p className="mb-[12px] font-normal text-secondary">{`${t( */}
										{/*			'mobile' */}
										{/*		)} (*)`}</p> */}
										{/*		<Form.Item */}
										{/*			name="mobile" */}
										{/*			rules={[ */}
										{/*				{ */}
										{/*					required: true, */}
										{/*					message: t('input_your_mobile_required'), */}
										{/*				}, */}
										{/*				() => ({ */}
										{/*					validator(_, value) { */}
										{/*						if (!value) { */}
										{/*							return Promise.resolve(); */}
										{/*						} */}
										{/*						if ( */}
										{/*							/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test( */}
										{/*								`${value.code}${value.number}` */}
										{/*							) */}
										{/*						) { */}
										{/*							return Promise.resolve(); */}
										{/*						} */}
										{/*						return Promise.reject(new Error(t('phone_invalid'))); */}
										{/*					}, */}
										{/*				}), */}
										{/*			]} */}
										{/*			validateStatus={errors.mobile ? 'error' : undefined} */}
										{/*			help={errors.mobile} */}
										{/*		> */}
										{/*			<PhoneNumberInput placeholder={t('input_mobile_placeholder')} /> */}
										{/*		</Form.Item> */}
										{/*	</div> */}
										{/*	{!hidenRPF && ( */}
										{/*		<div> */}
										{/*			<p className="mb-[12px] font-normal text-secondary">CPF</p> */}
										{/*			<Form.Item */}
										{/*				name="cpf" */}
										{/*				rules={[ */}
										{/*					{ */}
										{/*						required: stateStore.language === 'pt', */}
										{/*						pattern: /\d{3}\.\d{3}\.\d{3}-\d{2}$/, */}
										{/*						message: t('cpf_invalid'), */}
										{/*					}, */}
										{/*				]} */}
										{/*				validateStatus={errors.cpf ? 'error' : undefined} */}
										{/*				help={errors.cpf} */}
										{/*				normalize={(value, prevValue) => { */}
										{/*					if (value.length < prevValue?.length) { */}
										{/*						return value; */}
										{/*					} */}
										{/*					const v = value */}
										{/*						.replace(/\D/g, '') */}
										{/*						.replaceAll('.', '') */}
										{/*						.replaceAll('-', ''); */}

										{/*					if (v.length < 6) { */}
										{/*						return v.replace(/(\d{3})(\d)?/, '$1.$2'); */}
										{/*					} */}
										{/*					if (v.length < 9) { */}
										{/*						return v.replace(/(\d{3})(\d{3})(\d)?/, '$1.$2.$3'); */}
										{/*					} */}
										{/*					return v.replace( */}
										{/*						/^(\d{3})(\d{3})(\d{3})(\d)?/g, */}
										{/*						'$1.$2.$3-$4' */}
										{/*					); */}
										{/*				}} */}
										{/*			> */}
										{/*				<Input */}
										{/*					placeholder="000.000.000-00" */}
										{/*					className="w-full" */}
										{/*					data-qa="username-input" */}
										{/*				/> */}
										{/*			</Form.Item> */}
										{/*		</div> */}
										{/*	)} */}
										{/* </div> */}

										{/* <div> */}
										{/*	<p className="mb-[12px] font-normal text-secondary"> */}
										{/*		{t('Affiliate code')} */}
										{/*	</p> */}
										{/*	<Form.Item */}
										{/*		name="aai" */}
										{/*		rules={[ */}
										{/*			{ */}
										{/*				required: false, */}
										{/*			}, */}
										{/*			() => ({ */}
										{/*				validator(_, value) { */}
										{/*					if (value && value.length > 12) { */}
										{/*						return Promise.reject( */}
										{/*							t('Maximum {{count}} characters allowed', { */}
										{/*								count: 12, */}
										{/*							}) */}
										{/*						); */}
										{/*					} */}
										{/*					return Promise.resolve(); */}
										{/*				}, */}
										{/*			}), */}
										{/*		]} */}
										{/*		validateStatus={errors.aai ? 'error' : undefined} */}
										{/*		help={errors.aai} */}
										{/*		initialValue={query.get('_rc')} */}
										{/*	> */}
										{/*		<MaxLengthInput */}
										{/*			prefix={ */}
										{/*				<Image */}
										{/*					className="rounded-none mr-2" */}
										{/*					src={`/images/sign-up/code${ */}
										{/*						typeTheme === 'light' ? '-light' : '' */}
										{/*					}.svg`} */}
										{/*					alt="imageAlt" */}
										{/*				/> */}
										{/*			} */}
										{/*			length={12} */}
										{/*			placeholder={t('Input your affiliate code')} */}
										{/*		/> */}
										{/*	</Form.Item> */}
										{/* </div> */}
										<div>
											<Form.Item
												name="tos_consent"
												className="mb-0"
												valuePropName="checked"
												rules={[
													() => ({
														validator(_, value) {
															if (value) {
																return Promise.resolve();
															}
															return Promise.reject(
																new Error(
																	t(
																		'Please read carefully and agree with the terms and conditions before using Our Service'
																	)
																)
															);
														},
													}),
												]}
											>
												<Checkbox className="check-box-trans text-[14px] font-normal text-secondary">
													<Trans
														i18nKey="tos_consent"
														components={{
															tos: (
																<Link
																	to="/term-of-use"
																	className="underline"
																	target="_blank"
																>
																	<a className="underline" rel="noreferrer" />
																</Link>
															),
															privacy: (
																<Link
																	to="/privacy-policy"
																	className="underline"
																	target="_blank"
																>
																	<a className="underline" rel="noreferrer" />
																</Link>
															),
														}}
													/>
												</Checkbox>
											</Form.Item>
										</div>
										<Button
											type="primary"
											htmlType="submit"
											className="w-full py-2 mt-10 2xl:mt-5 button-primary h-[52px] rounded-[60px] text-[16px] shadow-none"
											loading={submitting}
											data-qa="sign-up-button"
										>
											{t('sign_up')}
										</Button>

										<div className="text-center mt-4">
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
						<div className="footer-primary text-center">
							<Footer />
						</div>
					</div>
				</div>
			</Layout>
		</ConfigProvider>
	);
});

export default Registration;
