export const BASE_COLORS = {
	white: '#ffffff',
	black: '#000000',
	green: '#008000',
	orange: '#ffb155',
	gray: '#808080',
	lightgrey: '#c5d3e0',
	violet: '#ee82ee',
	lightgreen: '#89dca0',
	pink: '#ffc0cb',
	blue: '#0000ff',
	skyblue: '#35a0dc',
	red: '#ff5252',
	brandPrimary: 'linear-gradient(266.07deg, #9b3fff -44.28%, #592df2 50.21%, #0747c3 182.35%)',
	brandReverse: 'linear-gradient(267.39deg, #0747c4 -1.09%, #6f08df 92.45%)',
	brandSecondary: '#f27f16',
	accentGreenPrimary: '#11cabe',
	accentPurple: '#bd47fb',
	accentGradientPattern: 'linear-gradient(180deg, #0522AC 0%, rgba(52, 56, 76, 0) 100%)',
	accentGradientBackGround:
		'radial-gradient(40.45% 40.45% at 50% 46.16%, rgba(1, 9, 80, 0.9) 3.12%, rgba(14, 17, 32, 0) 100%)',
	customGradient: 'linear-gradient(229deg, #02c173 0%, #e6ff09 100%)',
	yellow: '#e6ff00',
};

export const LAYOUT = {
	mobile: {
		paddingVertical: '0.75rem',
		paddingHorizontal: '1rem',
		headerHeight: '4.25rem',
		headerPadding: '1rem',
	},
	desktop: {
		paddingVertical: '1.25rem',
		paddingHorizontal: '2.25rem',
		headerHeight: '5.625rem',
	},
};

export const FONT_FAMILY = {
	main: 'Prompt',
	secondary: 'Lato',
	space: 'Space Grotesk',
	roboto: 'Roboto',
	primary: 'DM Sans',
};

export const FONT_SIZE = {
	xxs: '0.75rem',
	xs: '0.875rem',
	md: '1rem',
	lg: '1.125rem',
	xl: '1.25rem',
	xxl: '1.5rem',
	xxxl: '1.625rem',
	xxxxl: '2rem',
};

export const FONT_WEIGHT = {
	thin: '100',
	extraLight: '200',
	light: '300',
	regular: '400',
	medium: '500',
	semibold: '600',
	bold: '700',
	extraBold: '800',
	black: '900',
};

export const BREAKPOINTS = {
	xs: 360,
	sm: 568,
	md: 768,
	lg: 992,
	xl: 1280,
	xxl: 1920,
};

const getMedia = (breakpoint) => `(min-width: ${breakpoint}px)`;

export const media = {
	xs: getMedia(BREAKPOINTS.xs),
	sm: getMedia(BREAKPOINTS.sm),
	md: getMedia(BREAKPOINTS.md),
	lg: getMedia(BREAKPOINTS.lg),
	xl: getMedia(BREAKPOINTS.xl),
	xxl: getMedia(BREAKPOINTS.xxl),
};
