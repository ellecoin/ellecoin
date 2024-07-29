const Image = ({ className, src, alt, ...props }) => (
	<img src={`${process.env.PUBLIC_URL}${src}`} alt={alt} className={`${className || ''} inline-block`} {...props} />
);

export default Image;
