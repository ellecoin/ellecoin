import { Trans, withTranslation } from 'react-i18next';
import { Button, Input, Modal } from 'antd';
import React, { useState } from 'react';
import userService from '../../../../services/UserService';
import { useStore } from '../../../../context/AppContext';

const TerminateAccountModal = ({ t, open, onClose, onDeleted }) => {
	const { authStore } = useStore();
	const [consentValue, setConsentValue] = useState();

	const handleDelete = () => {
		userService.terminateAccount(authStore.user.user_name).then(() => {
			onDeleted?.();
		});
	};

	return (
		<Modal open={open} onCancel={() => onClose?.()} title={t('Confirm deletion')} footer={null}>
			<p>{t('Do you want to terminate your account? This action will remove your account from the system.')}</p>
			<p className="mt-4">
				<Trans
					i18nKey="terminate_account_confirm"
					components={{
						italic: <span className="italic" />,
					}}
					values={{
						content: 'Delete',
					}}
				/>
			</p>
			<Input placeholder="Delete" value={consentValue} onChange={(e) => setConsentValue(e.target.value)} />

			<div className="mt-8 flex justify-end">
				<Button className="mr-2" onClick={() => onClose?.()}>
					{t('cancel')}
				</Button>
				<Button type="primary" danger disabled={consentValue !== 'Delete'} onClick={() => handleDelete()}>
					{t('delete')}
				</Button>
			</div>
		</Modal>
	);
};

export default withTranslation()(TerminateAccountModal);
