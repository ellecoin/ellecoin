import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { ThemeContext } from '../../../context/ThemeContext';
import LightThemeIcon from '../../../assets/icons/LightThemeIcon';
import DarkThemeIcon from '../../../assets/icons/DarkThemeIcon';

const ThemeSelect = () => {
	const { changeTheme, typeTheme } = useContext(ThemeContext);
	const getTheme = () => {
		switch (typeTheme) {
			case 'dark':
				return <DarkThemeIcon />;
			default:
				return <LightThemeIcon />;
		}
	};

	const handleChangeTheme = () => {
		changeTheme(typeTheme === 'dark' ? 'light' : 'dark');
	};

	return (
		<div
			onClick={handleChangeTheme}
			className="w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer card-circle-primary"
		>
			{getTheme()}
		</div>
	);
};

export default withTranslation()(ThemeSelect);
