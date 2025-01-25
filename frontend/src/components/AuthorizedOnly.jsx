import React from 'react';
import { useAuth } from '../context/AuthContext';
import BlueButton from './UI/BlueButton';
import { Link } from 'react-router-dom';

const AuthorizedOnly = ({ children, returnMessage = false }) => {
	const { user } = useAuth();

	if (!user && !returnMessage) {
		return '';
	}
	if (!user && returnMessage) {
		return (<div className='text-center'>
			<h1 className='mt-8 font-semibold text-2xl mb-3 '>Для просмотра этого контента необходимо авторизоваться</h1>
			<BlueButton><Link to='/login'>Войти в акканут</Link></BlueButton>
		</div>);
	}

	return <>{children}</>;
};

export default AuthorizedOnly;
