import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MyButton from './UI/BlueButton';

const LogoutButton = ({ otherClasses }) => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<MyButton className={'hover:opacity-50 transition-opacity ' + otherClasses} onClick={handleLogout}>
			Выйти из аккаунта
		</MyButton>
	);
};

export default LogoutButton;