import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

export const PrivateRoute = ({ ...props }) => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Redirect to="/home" />;
	}
	return <Route {...props} />;
};

export const GuestRoute = ({ ...props }) => {
	const { isAuthenticated } = useAuth();
	if (isAuthenticated) {
		return <Redirect to="/" />;
	}
	return <Route {...props} />;
};

export const InformationRoute = ({ ...props }) => <Route {...props} />;
