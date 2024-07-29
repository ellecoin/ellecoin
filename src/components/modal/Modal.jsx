import { Button, Divider, Modal as ModalLib } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import InfoModalIcon from '../../assets/icons/InfoModalIcon';
import { MODAL_TYPES } from '../../constants/constants';

export const Modal = ({ title, type = 'warning', ...otherProps }) => {
	const { onCancel, onOk, children, hideCancel, okText, cancelText } = otherProps;
	const { t } = useTranslation();
	return (
		<ModalLib
			title={
				<div className="flex gap-3 items-center">
					{type === 'warning' && <InfoModalIcon color="#FFC107" />}

					{type === 'error' && <InfoModalIcon color="#FA2256" />}

					{type === 'success' && <InfoModalIcon color="#009120" />}
					{title}
				</div>
			}
			footer={null}
			{...otherProps}
		>
			<Divider className="my-4" />

			{children}

			<StyledButtons className={`text-right flex justify-end gap-2${children ? ' mt-4' : ''}`}>
				{type === MODAL_TYPES.warning && (
					<>
						{onCancel && !hideCancel && (
							<Button className={`button-primary${onOk ? '-outline--default' : ''}`} onClick={onCancel}>
								{t(cancelText || (onOk ? 'no' : 'cancel'))}
							</Button>
						)}

						{onOk && (
							<Button
								className="button-primary"
								onClick={() => {
									onOk?.();
									onCancel();
								}}
							>
								{okText || t('yes')}
							</Button>
						)}
					</>
				)}

				{type === MODAL_TYPES.error && (
					<>
						<Button className="button-primary-outline--default" onClick={onCancel}>
							{t('no')}
						</Button>
						<Button
							className="button-primary"
							onClick={() => {
								onOk?.();
								onCancel();
							}}
						>
							{okText || t('yes')}
						</Button>
					</>
				)}

				{type === MODAL_TYPES.success && (
					<Button
						className="button-primary"
						onClick={() => {
							onOk?.();
							onCancel();
						}}
					>
						{okText || t('close')}
					</Button>
				)}
			</StyledButtons>
		</ModalLib>
	);
};

const StyledButtons = styled('div')`
	button {
		height: 40px;
		border-radius: 8px;
	}
`;
