import React from 'react';
import { Space } from 'antd';
import footerIcons from '../../../../../assets/icons/footer/index';

const SocialMenu = () => {
	const socialLinks = {
		youtube: 'https://www.youtube.com/',
		twitter: 'https://twitter.com/',
		discord: 'https://discord.com/',
		frame: 'https://www.framer.com/',
		github: 'https://github.com/',
		telegram: 'https://telegram.org/',
	};

	return (
		<Space size="small" className="landing-footer-socail">
			<a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
				{footerIcons.youtube}
			</a>
			<a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
				{footerIcons.twitter}
			</a>
			<a href={socialLinks.discord} target="_blank" rel="noopener noreferrer">
				{footerIcons.discord}
			</a>
			<a href={socialLinks.frame} target="_blank" rel="noopener noreferrer">
				{footerIcons.frame}
			</a>
			<a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
				{footerIcons.github}
			</a>
			<a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer">
				{footerIcons.telegram}
			</a>
		</Space>
	);
};

export default SocialMenu;
