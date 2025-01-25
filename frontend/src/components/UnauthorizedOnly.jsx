import React from 'react';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './Logout';

const UnauthorizedOnly = ({ children, returnMessage = false }) => {
	const { user } = useAuth();

	if (user && returnMessage) {
		return (
			<div className='text-center font-semibold text-2xl mt-8'>
				Вы уже авторизованы. <LogoutButton otherClasses='underline'></LogoutButton>?
			</div>
		);
	}
	if (user && !returnMessage) {
		return;
	}

	return children;
};

export default UnauthorizedOnly;
