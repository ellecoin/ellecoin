import React from 'react';
import useMediaQuery from 'beautiful-react-hooks/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { BASE_COLORS, FONT_FAMILY } from '../../../../../styles/themes/constants';

const ExclusiveOffer = () => {
	const { t } = useTranslation();
	const isMobile = useMediaQuery('(max-width: 567px)');

	return (
		<div
			className="p-2 flex items-center justify-center relative"
			style={{
				background: BASE_COLORS.customGradient,
			}}
		>
			<div className="text-center flex items-center justify-center w-full h-full">
				<a
					href="/early-access"
					style={{
						fontFamily: FONT_FAMILY.roboto,
						fontWeight: '400',
						fontSize: isMobile ? '13px' : '17px',
						lineHeight: '161%',
						textTransform: 'uppercase',
						textAlign: 'center',
						color: BASE_COLORS.black,
					}}
				>
					&lt;{t('- EXCLUSIVE OFFER - 30 DAYS FREE TRIAL - Get Early Access-')}&gt;
				</a>
			</div>
		</div>
	);
};

export default ExclusiveOffer;
