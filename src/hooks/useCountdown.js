import { useEffect, useState } from 'react';

export default function useCountdown() {
	const [secondLeft, setSecondsLeft] = useState(0);

	useEffect(() => {
		if (secondLeft < 0) return;

		const timeout = setTimeout(() => {
			setSecondsLeft(secondLeft - 1);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [secondLeft]);

	function start(seconds) {
		setSecondsLeft(seconds);
	}

	return { secondLeft, start };
}
