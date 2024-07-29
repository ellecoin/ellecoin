import React from 'react';
import { siteConfig } from '../../data/SiteConfig';

const Footer = () => (
	<div className="footer-primary">
		{siteConfig.copyRightContent ? (
			<div
				className="copyright text-center"
				dangerouslySetInnerHTML={{
					__html: siteConfig.copyRightContent.replaceAll('{{year}}', new Date().getFullYear()),
				}}
			/>
		) : (
			<div className="copyright text-center">
				<p className="text-center">Copyright © All Rights Reserved {d.getFullYear()}</p>
			</div>
		)}
	</div>
);

export default Footer;
