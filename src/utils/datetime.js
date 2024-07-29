import dayjs from 'dayjs';

export const getPreviousDays = (number = 0, date = '') => {
	const result = [];

	for (let i = number; i > 0; i -= 1) {
		const previousDay = dayjs(date).subtract(i, 'day');
		const formattedDate = previousDay.format('YYYY-MM-DD');
		result.push(formattedDate);
	}

	return result;
};

export const renderDateRange = (start_Date, end_Date) => {
	const startDate = dayjs.tz(parseInt(start_Date) * 1000).format('DD/MM/YYYY');
	const endDate = dayjs.tz(parseInt(end_Date) * 1000).format('DD/MM/YYYY');
	return (
		<p className="text-primary text-[14px]">
			{startDate} - {endDate}
		</p>
	);
};

export const getTimeFromStamp = (timestamp) => {
	if (!timestamp) return '-';
	const dateFormat = dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY HH:mm:ss');
	return <p className="text-primary text-[14px]"> {dateFormat}</p>;
};

export const getDiffTimeTamps = (start_time, end_time) => {
	if (!start_time || !end_time) return '-';

	const durationInSeconds = end_time - start_time;

	const hours = Math.floor(durationInSeconds / 3600);
	const minutes = Math.floor((durationInSeconds % 3600) / 60);
	const seconds = durationInSeconds % 60;

	let result = '';

	result += `${hours.toString().padStart(2, '0')}:`;
	result += `${minutes.toString().padStart(2, '0')}:`;
	result += seconds.toString().padStart(2, '0');

	return result;
};

export const getDateFromTimeStampText = (timestamp) => {
	if (!timestamp) return '-';
	return dayjs.tz(parseInt(timestamp) * 1000).format('DD/MM/YYYY');
};

export const getDateFromText = (datetime) => dayjs(datetime).format('DD/MM/YYYY');
