const ArrowLeftIcon = ({ width = 24, height = 24, className, color, onClick }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={width}
		height={height}
		className={className}
		viewBox="0 0 24 25"
		fill="none"
		onClick={onClick}
	>
		<path d="M19 12.2168H5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		<path
			d="M12 19.2168L5 12.2168L12 5.2168"
			stroke={color}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export default ArrowLeftIcon;
