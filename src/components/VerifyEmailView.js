import { Button, Divider } from 'antd';
import { Trans, withTranslation, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import React from 'react';

const VerifyEmailView = ({ t, className }) => {
	const { t: t1 } = useTranslation();
	return (
		<div className={className}>
			<p className="text-center text-primary text-[18px] font-bold">{t('register_account_success')}</p>
			<p className="text-left mt-8 mb-8 text-secondary text-[16px] font-normal">{t('active_guide_1')}</p>
			<p className="text-left text-primary text-[14px] font-bold">{t('no_email')}</p>
			<ul className="list-disc text-left ml-8">
				{t1('active_guide_2', { returnObjects: true }).map((item) => (
					<li className="text-[14px]">
						<Trans i18nKey={item} components={[<strong />, <em />]} />
					</li>
				))}
			</ul>
			<Divider />
			<Link to="/login" rel="noreferrer" className="flex items-center justify-center">
				<Button type="primary" className="button-primary h-[60px] w-[200px] rounded-full">
					{t('sign_me_in')}
				</Button>
			</Link>
		</div>
	);
};

export default withTranslation()(VerifyEmailView);
