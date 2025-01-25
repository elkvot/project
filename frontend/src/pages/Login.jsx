import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import BlueButton from '../components/UI/BlueButton';

const Login = () => {
	const { login } = useAuth();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const validateForm = () => {
		// Проверка на пустое имя пользователя
		if (!username.trim()) {
			setError('Имя пользователя не может быть пустым.');
			return false;
		}

		// Проверка на латинские буквы, отсутствие пробелов и специальных символов
		const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*$/; // Имя пользователя должно начинаться с латинской буквы и содержать только латинские буквы и цифры
		if (!usernameRegex.test(username)) {
			setError('Имя пользователя должно начинаться с латинской буквы и содержать только латинские буквы и цифры.');
			return false;
		}

		// Проверка на минимальную длину пароля
		if (password.length < 6) {
			setError('Пароль должен содержать не менее 6 символов.');
			return false;
		}

		// Проверка на латинские буквы и цифры в пароле
		const passwordRegex = /^[a-zA-Z0-9]+$/; // Пароль должен содержать только латинские буквы и цифры
		if (!passwordRegex.test(password)) {
			setError('Пароль должен содержать только латинские буквы и цифры.');
			return false;
		}

		setError('');
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const response = await fetch('http://localhost:5000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await response.json();
			if (response.ok) {
				login({ token: data.token });
				navigate('/myprofile');
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError('Ошибка входа. Попробуйте еще раз.');
		}
	};

	return (
		<form name='loginform' onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded shadow-lg w-full max-w-xs mt-5 mx-auto">
			<h2 className="text-2xl mb-4 text-center">Вход</h2>
			{error && <p className="text-red-500 mb-4">{error}</p>}
			<input
				name='input'
				type="text"
				placeholder="Имя пользователя"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
				className="border border-gray-300 p-2 mb-4 w-full rounded transition-colors focus:border-blue-500 outline-none"
			/>
			<input
				name='input'
				type="password"
				placeholder="Пароль"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				className="border border-gray-300 p-2 mb-4 w-full rounded transition-colors focus:border-blue-500 outline-none"
			/>
			<BlueButton type="submit" otherClasses="p-2 w-full">
				Войти
			</BlueButton>
			<Link to="/register">
				<button type="button" className="mt-2 text-blue-500 hover:underline w-full">
					Зарегистрироваться
				</button>
			</Link>
		</form>
	);
};

export default Login;