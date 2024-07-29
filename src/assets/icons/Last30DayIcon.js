const Last30DayIcon = ({ width = 38, height = 35, typeTheme }) => {
	if (typeTheme === 'dark') {
		return (
			<svg width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="45.5" cy="45.5" r="45.5" fill="url(#paint0_linear_1521_42683)" />
				<circle cx="45.5" cy="45.5" r="45.5" fill="url(#paint1_linear_1521_42683)" />
				<g filter="url(#filter0_d_1521_42683)">
					<path
						d="M63.672 50.3924H56.2501C53.525 50.3907 51.3161 48.1836 51.3145 45.4584C51.3145 42.7333 53.525 40.5261 56.2501 40.5244H63.672"
						stroke="#BD47FB"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M57.0899 45.3452H56.5185"
						stroke="#BD47FB"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M38.2047 29.5H54.051C59.3643 29.5 63.6717 33.8074 63.6717 39.1207V52.2786C63.6717 57.5919 59.3643 61.8993 54.051 61.8993H38.2047C32.8914 61.8993 28.584 57.5919 28.584 52.2786V39.1207C28.584 33.8074 32.8914 29.5 38.2047 29.5Z"
						stroke="#BD47FB"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M36.8984 37.8198H46.7965"
						stroke="#BD47FB"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>
				<defs>
					<filter
						id="filter0_d_1521_42683"
						x="20"
						y="20"
						width="52"
						height="52"
						filterUnits="userSpaceOnUse"
						colorInterpolationFilters="sRGB"
					>
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix
							in="SourceAlpha"
							type="matrix"
							values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
							result="hardAlpha"
						/>
						<feOffset />
						<feGaussianBlur stdDeviation="2" />
						<feColorMatrix type="matrix" values="0 0 0 0 0.982039 0 0 0 0 0.101961 0 0 0 0 1 0 0 0 1 0" />
						<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1521_42683" />
						<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1521_42683" result="shape" />
					</filter>
					<linearGradient
						id="paint0_linear_1521_42683"
						x1="-76"
						y1="-91.5"
						x2="176"
						y2="179"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#6853F9" stopOpacity="0.8" />
						<stop offset="0.5" stopColor="#415AF9" stopOpacity="0" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_1521_42683"
						x1="0"
						y1="0"
						x2="156"
						y2="141"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0.215428" stopColor="#C841F9" stopOpacity="0" />
						<stop offset="1" stopColor="#CA41F9" stopOpacity="0.6" />
					</linearGradient>
				</defs>
			</svg>
		);
	}

	return (
		<svg width="91" height="91" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle
				cx="64.3467"
				cy="64.3477"
				r="45.5"
				transform="rotate(-45 64.3467 64.3477)"
				fill="url(#paint0_linear_3064_45370)"
			/>
			<circle cx="64.3467" cy="64.3477" r="45.5" transform="rotate(-45 64.3467 64.3477)" fill="#E683FF" />
			<path
				d="M82.5197 71.2391H75.0978C72.3726 71.2374 70.1638 69.0302 70.1621 66.3051C70.1621 63.5799 72.3726 61.3728 75.0978 61.3711H82.5197"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M75.9375 66.1928H75.3661"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M57.0524 50.3477H72.8986C78.2119 50.3477 82.5194 54.6551 82.5194 59.9684V73.1263C82.5194 78.4396 78.2119 82.747 72.8986 82.747H57.0524C51.7391 82.747 47.4316 78.4396 47.4316 73.1263V59.9684C47.4316 54.6551 51.7391 50.3477 57.0524 50.3477Z"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M55.7461 58.6675H65.6442"
				stroke="white"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<defs>
				<linearGradient
					id="paint0_linear_3064_45370"
					x1="64.8158"
					y1="-25.2451"
					x2="64.8158"
					y2="190.059"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#6853F9" stopOpacity="0.8" />
					<stop offset="0.335564" stopColor="#415AF9" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
};

export default Last30DayIcon;
