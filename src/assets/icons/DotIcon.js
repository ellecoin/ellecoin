const DotIcon = ({ width = 18, height = 18, color = '#A5ADCF', className }) => (
	<svg
		className={className}
		width={width}
		height={height}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
		id="dot"
	>
		<path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z" fill={color} />
	</svg>
);

export default DotIcon;
