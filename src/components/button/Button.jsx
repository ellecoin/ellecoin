import { Button } from 'antd';
import { withTranslation } from 'react-i18next';

export const CancelButton = withTranslation()(({ t, i18n, tReady, ...props }) => (
	<Button className="button-primary-outline--default min-w-[84px]" {...props}>
		{t('cancel')}
	</Button>
));

export const AcceptButton = withTranslation()(({ t, i18n, tReady, ...props }) => (
	<Button {...props} className={`button-primary min-w-[84px] ${props?.className}`}>
		{props?.children || t('ok')}
	</Button>
));

export const LinkButton = (props) => <Button type="link" {...props} />;
