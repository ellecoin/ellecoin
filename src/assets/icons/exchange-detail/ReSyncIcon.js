const ReSyncIcon = ({ width = 16, height = 17, color = 'white', className }) => (
	<svg
		width="36"
		height="36"
		viewBox="0 0 36 36"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className={className}
	>
		<rect width="36" height="36" rx="18" fill="transparent" fillOpacity="0.25" />
		<path
			d="M26 17.0007C25.7554 15.2409 24.9391 13.6103 23.6766 12.3602C22.4142 11.11 20.7758 10.3096 19.0137 10.0822C17.2516 9.85487 15.4636 10.2132 13.9252 11.1019M10 11.0007V15.0007H14"
			stroke={color}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10 19C10.2446 20.7598 11.0609 22.3903 12.3234 23.6405C13.5858 24.8907 15.2242 25.6911 16.9863 25.9184C18.7484 26.1458 20.5364 25.7875 22.0748 24.8988M26 25V21H22"
			stroke={color}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<rect
			x="0.5"
			y="0.5"
			width="35"
			height="35"
			rx="17.5"
			stroke="url(#paint0_linear_695_87522)"
			strokeOpacity="0.4"
		/>
		<defs>
			<linearGradient
				id="paint0_linear_695_87522"
				x1="3.02732e-07"
				y1="18"
				x2="43.3184"
				y2="14.6643"
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#4976CD" />
				<stop offset="0.9999" stopColor="#6D5CDA" stopOpacity="0.7" />
				<stop offset="1" stopColor="#4A455E" stopOpacity="0" />
			</linearGradient>
		</defs>
	</svg>
);

export default ReSyncIcon;
