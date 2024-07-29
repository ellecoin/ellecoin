export const capitalizeFirstLetter = (str) => {
	const [firstChar, ...rest] = str;
	return firstChar.toUpperCase() + rest.join('');
};
