import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaulConfig = {
	position: 'top-right',
	autoClose: 3000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: true,
	progress: undefined,
	theme: 'colored',
};

export const toastify = {
	info(message = 'Information') {
		toast.info(message, {
			...defaulConfig,
		});
	},
	success(message = 'Success') {
		toast.success(message, {
			...defaulConfig,
		});
	},
	error(message = 'Error') {
		toast.error(message, {
			...defaulConfig,
		});
	},
	warning(message = 'Warning') {
		toast.warning(message, {
			...defaulConfig,
		});
	},
};

const ToastContainerComponent = (props) => (
	<ToastContainer
		position="top-right"
		autoClose={5000}
		hideProgressBar={false}
		newestOnTop={false}
		closeOnClick
		rtl={false}
		pauseOnFocusLoss={false}
		draggable
		pauseOnHover
		theme="colored"
		{...props}
	/>
);

export default ToastContainerComponent;
