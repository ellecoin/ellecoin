import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { Button, Layout, theme } from 'antd';
import { Link, useParams } from 'react-router-dom';

import Image from '../../components/Image';
import Footer from '../../components/footer/Footer';
import backgroundImage from '../../assets/images/background-image.png';
import LanguageDropdown from '../../components/header/component/LanguageDropdown';
// import ThemeSelect from '../../components/header/component/ThemeSelect';
import { ThemeContext } from '../../context/ThemeContext';

const { useToken } = theme;

const ActivateResult = ({ t, i18n, history }) => {
	const { result } = useParams();
	const { token } = useToken();
	const { typeTheme } = useContext(ThemeContext);

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
						<div className="w-full card-primary py-[32px] md:px-[48px] max-w-[539px] flex flex-col items-center gap-8">
							<div className=" mb-[30px] h-[40px]">
								<Image
									src={
										typeTheme === 'dark'
											? '/images/new-logo-large.svg'
											: '/images/new-logo-large-light.svg'
									}
									alt={name}
								/>
							</div>
							{result === 'success' ? (
								<div className="text-center">
									<div className="text-[green] bg-[green]/10 px-8 py-8 rounded mb-4">
										{t('activate_success')}
									</div>
								</div>
							) : (
								<div>
									<div className="text-[red] bg-[red]/10 px-8 py-8 rounded mb-4">
										{t('activate_fail')}
									</div>
								</div>
							)}
							<Link to="/login">
								<Button
									className="button-primary h-[65px] w-[240px] rounded-full"
									type="primary"
									data-qa="reset-password-button"
								>
									{t('sign_in')}
								</Button>
							</Link>
						</div>
					</div>
					<div className="text-center">
						<Footer />
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default withTranslation()(observer(ActivateResult));
