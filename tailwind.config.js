const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		colors: {
			'green-01': '#11CABE',
			'green-02': '#30E0A1',
			'red-01': '#FA2256',
			...colors,
		},

		extend: {
			screens: {
				xs: '375px',
			},
		},
		// backgroundImage: {
		// 	'custom-gradient': 'linear-gradient(229deg, #02c173 0%, #e6ff09 100%)',
		// },
	},

	plugins: [require('@tailwindcss/typography')],
	important: true,
};
