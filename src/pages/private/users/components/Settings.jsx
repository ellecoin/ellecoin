import { Flex, Select } from 'antd';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import Image from '../../../../components/Image';
import timezones from '../../../../utils/timezones';
import { useStore } from '../../../../context/AppContext';
import { LANGUAGE } from '../../../../utils/language';
import userService from '../../../../services/UserService';
import { CURRENCIES } from '../../../../constants/currency';

const { Option } = Select;

const Settings = ({ t, i18n }) => {
	const { authStore, stateStore } = useStore();
	return (
		<div className="card-primary">
			<p className="text-primary font-semibold text-[16px] mb-[16px]">{t('settings')}</p>
			<Flex vertical gap="middle">
				<div>
					<p className="mb-2 text-secondary text-[16px]">{t('language')}</p>
					<Select
						className="w-full"
						value={stateStore.language}
						onChange={(value) => {
							stateStore.setLanguage(value);
							i18n.changeLanguage(value);
						}}
					>
						{LANGUAGE.map(({ label, path, key, alt }) => (
							<Option key={key}>
								<Image className="w-[20px] rounded-none mr-2" src={path} alt={alt} />
								{label}
							</Option>
						))}
					</Select>
				</div>
				<div>
					<p className="mb-2 text-secondary text-[16px]">{t('currency')}</p>
					<Select
						className="w-full"
						value={authStore.user.currency}
						onChange={(value) => {
							stateStore.setCurrency(value);
						}}
					>
						{CURRENCIES.map((currency) => (
							<Option key={currency.value}>{currency.label}</Option>
						))}
					</Select>
				</div>
				<div>
					<p className="mb-2 text-secondary text-[16px]">{t('timezone')}</p>
					<Select
						className="w-full"
						data-qa="timezone-select"
						showSearch
						filterOption={(input, option) => option.label?.toLowerCase().includes(input.toLowerCase())}
						options={Object.keys(timezones).map((zone) => ({
							value: zone,
							label: timezones[zone],
						}))}
						value={authStore.user.timezone}
						onChange={(zone) => {
							authStore.updateUser({ timezone: zone });
							userService.updateProfile({ timezone: zone }).then(() => {});
						}}
					/>
				</div>
			</Flex>
		</div>
	);
};

export default withTranslation()(observer(Settings));
