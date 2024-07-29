import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Button, Divider, Modal, Typography } from 'antd';
import { withTranslation } from 'react-i18next';
import { useStore } from '../../context/AppContext';
import userService from '../../services/UserService';
import useCountdown from '../../hooks/useCountdown';
import { ThemeContext } from '../../context/ThemeContext';

const ActiveAccount = ({ t, openModal, setOpenModal, email }) => {
	const { authStore } = useStore();
	const { typeTheme } = useContext(ThemeContext);

	const { secondLeft, start } = useCountdown();

	const onRecentActMail = () => {
		try {
			userService.resendActivationEmail('', email).then();
			start(60);
		} catch (error) {
			console.log('onRecentActMail', error);
		}
	};

	const onLogout = () => {
		authStore.logout();
		setOpenModal(false);
	};

	const renderFooter = () => (
		<div className="flex flex-col">
			<Typography className="text-center decoration-[#EBEBE4] text-[13px]">{t(`did_not_receive`)}</Typography>
			<div className="flex flex-col items-center justify-center">
				<Button
					className="w-1/2 bg-[#2180f8] h-[40px] rounded-[60px] mt-2"
					onClick={() => onRecentActMail()}
					disabled={secondLeft > 0}
				>
					<span className="text-[#FFFFFF]">{t(`resend_email`)}</span>
				</Button>
				<a
					className={`underline text-[14px] mt-2 hover:text-[#2180f8] ${
						typeTheme === 'dark' ? 'text-[#A5ADCF]' : 'text-[#58667E]'
					}`}
					onClick={() => onLogout()}
				>
					{t(`back_to_login`)}
				</a>
			</div>

			<Typography className="text-center text-[14px]">
				{secondLeft > 0 && `${t('timeout_resend')} (${secondLeft})`}
			</Typography>
		</div>
	);

	return (
		<>
			<div className="flex align-items-center" />
			<Modal
				open={openModal}
				title={<p className="text-center">{t('active_account')}</p>}
				footer={renderFooter()}
				closeIcon={null}
				closable={false}
				width={600}
			>
				<div>
					<p className="text-center font-semibold">{t('resend_email_des')}</p>
					<p className="italic font-medium text-[14px]">{t('resend_email_tip')}</p>
					<Divider className="my-[12px]" />
				</div>
			</Modal>
		</>
	);
};

export default observer(withTranslation()(ActiveAccount));
