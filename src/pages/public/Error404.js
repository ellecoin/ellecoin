import React from 'react';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { Button, Layout, theme } from 'antd';
import LanguageDropdown from '../../components/header/component/LanguageDropdown';
// import ThemeSelect from '../../components/header/component/ThemeSelect';
import backgroundImage from '../../assets/images/404.png';
import Image from '../../components/Image';

const { useToken } = theme;

const Error404 = ({ t }) => {
	const { token } = useToken();
	return (
		<Layout className="h-screen" style={{ color: token.colorTextBase }}>
			<div className="h-full flex flex-col items-center text-primary md:px-[70px] md:py-[30px] p-[30px]">
				<div className="flex justify-end items-center mb-[80px] space-x-6 w-full">
					<LanguageDropdown />
					{/* <ThemeSelect /> */}
				</div>
				<div className="w-full h-full flex flex-col items-center justify-center gap-5 text-center">
					<div
						className="h-[200px] md:h-[400px] w-full bg-no-repeat bg-contain bg-center flex justify-center items-center"
						style={{ backgroundImage: `url(${backgroundImage})` }}
					>
						<Image src="/images/robot.png" className="mt-8 md:ml-12 md:ml-10 h-1/2 w-auto md:h-auto" />
					</div>
					<p className="text-primary font-extrabold text-[20]">{t('page_404_message')}</p>
					<p className="text-secondary text-[20]">{t('page_404_reason')}</p>
					<Link to="/">
						<Button className="button-primary--center h-[58px] font-semibold text-[16px] px-8">
							{t('back_to_home')}
						</Button>
					</Link>
				</div>
			</div>
		</Layout>
	);
};

export default withTranslation()(Error404);
