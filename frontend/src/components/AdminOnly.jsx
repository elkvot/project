import React from 'react';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';

const AdminOnly = ({ children, returnMessage = false }) => {
	const { user } = useAuth();
	const [profileData] = useProfile(user);
	if (!profileData && returnMessage) {
		return (
			<div className='mt-8 text-2xl font-semibold'>
				Ошибка заргузки данных профиля.
			</div>
		);
	}
	if(!profileData && !returnMessage) {
		return;
	}
	if(!profileData.is_admin && returnMessage) {
		return (
			<div className='mt-8 text-2xl font-semibold'>
				У вас недостаточно прав для просмотра этого контента.
			</div>
		);
	}
	if(!profileData.is_admin && !returnMessage) {
		return;
	}

	return children;
};

export default AdminOnly;