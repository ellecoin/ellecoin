import { css } from 'styled-components';

import { BASE_COLORS } from './constants';
import { darkColorsTheme, antDarkColorsTheme } from './dark/darkTheme';
import { lightColorsTheme } from './light/lightTheme';

export const themeObject = {
	light: lightColorsTheme,
	dark: darkColorsTheme,
};

export const antThemeObject = {
	light: {},
	dark: antDarkColorsTheme,
};

const getThemeVariables = (theme) => css`
	color-scheme: ${theme};
	--primary-color: ${themeObject[theme].primary};
	--info-color: var(--primary-color);
	--secondary-color: ${themeObject[theme].secondary};
	--error-color: ${themeObject[theme].error};
	--warning-color: ${themeObject[theme].warning};
	--success-color: ${themeObject[theme].success};
	--background-color: ${themeObject[theme].background};
	--border-color: ${themeObject[theme].borderColor};
	--text-base-color: ${themeObject[theme].colorTextBase};
	--text-primary-color: ${themeObject[theme].textPrimary};
	--text-secondary-color: ${themeObject[theme].textSecondary};
	--text-tertiary-color: ${themeObject[theme].textTertiary};
	--text-third-color: ${themeObject[theme].textThird};
	--text-fourth-color: ${themeObject[theme].textFourth};
	--text-fifth-color: ${themeObject[theme].textFifth};
	--text-default-color: ${themeObject[theme].defaultText};
	--text-landing-color: ${themeObject[theme].textLanding};
	--background-landing: ${themeObject[theme].backgroundLanding};
	--text-gray: ${themeObject[theme].textGray};

	//card
	--card-background-gradient: ${themeObject[theme].bgGradientCard};
	--color-card-circle: ${themeObject[theme].colorCardCircle};
	--color-card-circle-secondary: ${themeObject[theme].colorCardCircleSecondary};
	--color-card-circle-third: ${themeObject[theme].colorCardCircleThird};
	--card-third-color: ${themeObject[theme].cardThirdColor};
	--card-fourth-color: ${themeObject[theme].cardFourthColor};
	--card-walet-color: ${themeObject[theme].cardWalletColor};
	--card-primary-color: ${themeObject[theme].cardPrimaryColor};
	--card-secondary-color: ${themeObject[theme].cardSecondaryColor};
	--card-wallet-error-shadow-color: ${themeObject[theme].cardWalletShadowColor};
	--card-primary-shadow: ${themeObject[theme].cardPrimaryShadow};

	//button
	--color-bg-button-primary: ${themeObject[theme].colorBgButtonPrimary};
	--color-bg-button-primary-center: ${themeObject[theme].colorBgButtonPrimaryCenter};
	--color-bg-button-danger: ${themeObject[theme].colorBgButtonDanger};
	--color-bg-button-secondary: ${themeObject[theme].colorBgButtonSecondary};
	--color-button: ${themeObject[theme].colorButton};
	--color-button-link: ${themeObject[theme].colorButtonLink};
	--color-bg-button-primary-active: ${themeObject[theme].colorBgButtonPrimaryActive};
	--color-button-primary-active: ${themeObject[theme].colorButtonPrimaryActive};
	--color-bg-button-primary-inactive: ${themeObject[theme].colorBgButtonPrimaryInactive};
	--color-button-primary-inactive: ${themeObject[theme].colorButtonPrimaryInactive};
	--color-bg-button-primary-choose-active: ${themeObject[theme].colorBgButtonPrimaryChooseActive};
	--color-button-primary-choose-active: ${themeObject[theme].colorButtonPrimaryChooseActive};
	--color-bg-button-primary-choose-inactive: ${themeObject[theme].colorBgButtonPrimaryChooseInactive};
	--color-button-primary-choose-inactive: ${themeObject[theme].colorButtonPrimaryChooseInactive};
	--color-bg-button-outline-default: ${themeObject[theme].colorBgButtonOutlineDefault};
	--color-border-button-outline-default: ${themeObject[theme].colorBorderButtonOutLineDefault};
	--color-bg-button-default: ${themeObject[theme].colorBgButtonPrimary};
	--color-bg-button-disabled: ${themeObject[theme].colorBgButtonDisabled};
	--color-button-disabled: ${themeObject[theme].colorButtonDisabled};

	// footer
	--color-footer-primary: ${themeObject[theme].colorFooterPrimary};
	--color-footer-btn: ${themeObject[theme].colorFooterPrimary2};
	--color-footer-text: ${themeObject[theme].colorFooterPrimary3};
	--landing-footer-text: ${themeObject[theme].landingFooterText};

	// sider
	--text-sider-primary-color: ${themeObject[theme].colorTextSiderPrimary};
	--text-sider-secondary-color: ${themeObject[theme].colorTextSiderSecondary};
	--menu-item-sider-primary-color: ${themeObject[theme].colorBgSiderMenuItem};
	--menu-item-sider-primary-color-hover: ${themeObject[theme].colorBgSiderMenuItemHover};

	//icon
	--color-trash-icon: ${themeObject[theme].trashIcon};

	//banner
	--banner-image: ${themeObject[theme].bannerImage};

	// menu
	--color-bg-menu-primary: ${themeObject[theme].coloBgMenuPrimary};
	--color-bg-menu-secondary: ${themeObject[theme].coloBgMenuSecondary};

	// link
	--color-link-primary: ${themeObject[theme].colorLinkPrimary};

	// pagination
	--color-pagination-item-primary: ${themeObject[theme].paginationItemColorPrimary};
	--color-text-pagination-primary: ${themeObject[theme].paginationTextColorPrimary};
	--color-pagination-item-secondary: ${themeObject[theme].paginationItemColorSecondary};
	--color-text-pagination-secondary: ${themeObject[theme].paginationTextColorSecondary};

	// dropdown
	--color-bg-dropdown-primary: ${themeObject[theme].colorBgDropdown};

	// notification
	--color-bg-item-notify-active: ${themeObject[theme].colorBgItemNotifyActive};
	--color-bg-item-notify-card-avatar: ${themeObject[theme].colorCardItemNotifyAvatar};
	--color-item-notify-avatar: ${themeObject[theme].colorItemNotifyAvatar};

	// scroll
	--scroll-color: ${themeObject[theme].scroll};

	// slider
	--color-slider-title: ${themeObject[theme].colorSliderTitle};
	--color-slider-subtitle: ${themeObject[theme].colorSliderSubtitle};
	--color-bg-button-slider: ${themeObject[theme].colorBgButtonSlider};
	--color-button-slider: ${themeObject[theme].colorButtonSlider};
	--color-bg-slider: ${themeObject[theme].colorBgSlider};

	// input
	--color-bg-input: ${themeObject[theme].inputBg};
	--color-text-input: ${themeObject[theme].colorTextBase};
	--color-icon-input: ${themeObject[theme].colorIconInput};

	// switch
	--color-bg-switch: ${themeObject[theme].colorBgSwitch};

	// bot-icon
	--color-bot-icon-1: ${themeObject[theme].botIcon1};
	--color-bot-icon-2: ${themeObject[theme].botIcon2};
	--color-bot-icon-3: ${themeObject[theme].botIcon3};

	// table
	--color-bg-table: ${themeObject[theme].colorBgTable};

	// steps
	--color-border-steps: ${themeObject[theme].colorBorderStepsDisable};
	--color-bg-steps-disable: ${themeObject[theme].colorBgStepsDisable};
	--color-bg-steps-finish: ${themeObject[theme].colorBgStepsFinish};

	// select
	--color-select: ${themeObject[theme].textColorSelect};
	--border-color-select: ${themeObject[theme].borderColorSelect};
`;

export const lightThemeVariables = css`
	${getThemeVariables('light')}
`;

export const darkThemeVariables = css`
	${getThemeVariables('dark')}
	--ant-success-color-deprecated-bg: ${antThemeObject.dark.successBg} !important;
	--ant-success-color-deprecated-border: ${antThemeObject.dark.successBorder} !important;
`;

export const commonThemeVariables = css`
	color-scheme: light dark;
	--white: ${BASE_COLORS.white};
	--black: ${BASE_COLORS.black};
	--green: ${BASE_COLORS.green};
	--orange: ${BASE_COLORS.orange};
	--gray: ${BASE_COLORS.gray};
	--lightgrey: ${BASE_COLORS.lightgrey};
	--violet: ${BASE_COLORS.violet};
	--lightgreen: ${BASE_COLORS.lightgreen};
	--pink: ${BASE_COLORS.pink};
	--blue: ${BASE_COLORS.blue};
	--skyblue: ${BASE_COLORS.skyblue};
	--red: ${BASE_COLORS.red};
	--yellow: ${BASE_COLORS.yellow};
`;

export const antOverrideCssVariables = css`
	--ant-primary-1: var(--primary1-color) !important;
`;
