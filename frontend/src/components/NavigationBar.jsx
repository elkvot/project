import React from 'react';
import { Link } from "react-router-dom";
import LogoutButton from "./Logout";
import AdminOnly from './AdminOnly';
import AuthorizedOnly from './AuthorizedOnly';
import UnauthorizedOnly from './UnauthorizedOnly';

export default function NavigationBar() {
	return (
		<header className='flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100'>
			<Link to='/' className='text-xl font-bold hover:opacity-50 transition-opacity'>dolor ipsum</Link>
			<nav className='flex items-center space-x-4'>
				<AuthorizedOnly>
					<LogoutButton />
					<Link to="/myprofile" className='hover:opacity-50 mr-3 md:mr-0 transition-opacity'>Мой профиль</Link>
				</AuthorizedOnly>
				<UnauthorizedOnly>
					<Link to='/login' className='hover:opacity-50 mr-3 md:mr-0 transition-opacity'>Войти</Link>
				</UnauthorizedOnly>
				<AdminOnly>
					<Link to="/admin" className='hover:opacity-50 mr-3 md:mr-0 transition-opacity'>Админ панель</Link>
				</AdminOnly>
				<Link to="/about" className='hover:opacity-50 mr-3 md:mr-0 transition-opacity'>О нас</Link>
				<Link to="/job" className='hover:opacity-50 mr-3 md:mr-0 transition-opacity'>Заказы</Link>
			</nav>
		</header>
	);
}
