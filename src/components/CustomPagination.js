import { useContext } from 'react';
import { Pagination } from 'antd';
import { withTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';

const CustomPagination = ({
	t,
	className,
	total,
	currentPage,
	pageSize,
	showCounter = true,
	onChange,
	disabled = false,
}) => {
	const { typeTheme } = useContext(ThemeContext);
	return (
		<div className={`${className || ''} md:flex md:justify-between md:items-center md:w-full`}>
			{showCounter && (
				<div
					className={`text-center mb-2 md:text-left md:mb-0 text-[14px] text-fourth ${
						typeTheme === 'dark' ? 'text-[#5D6589]' : 'text-[#58667E]'
					}`}
				>
					{total === 0
						? t('No Items')
						: t('paging_description', {
								from: Math.min((currentPage - 1) * pageSize + 1, total),
								to: Math.min(currentPage * pageSize, total),
								total,
						  })}
				</div>
			)}

			<div className="flex justify-center md:justify-end">
				<Pagination
					total={total}
					current={currentPage}
					pageSize={pageSize}
					showLessItems
					showSizeChanger={false}
					onChange={(page, pageSize) => !disabled && onChange?.(page, pageSize)}
					itemRender={(page, type, originalElement) => {
						if (type === 'page' && page > 99) {
							return (
								<a className="text-[11px]" rel="nofollow">
									{page}
								</a>
							);
						}
						return originalElement;
					}}
				/>
			</div>
		</div>
	);
};

export default withTranslation()(CustomPagination);
