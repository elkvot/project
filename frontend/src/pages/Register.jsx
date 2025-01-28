import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BlueButton from '../components/UI/BlueButton';

const Register = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const validateForm = () => {
		if (!username.trim()) {
			setError('Имя пользователя не может быть пустым.');
			return false;
		}

		if (/^\d/.test(username)) {
			setError('Имя пользователя не должно начинаться с цифры.');
			return false;
		}

		if (!/^[a-zA-Z0-9]+$/.test(username)) {
			setError('Имя пользователя может содержать только латинские буквы и цифры.');
			return false;
		}

		if (password.length < 6) {
			setError('Пароль должен содержать не менее 6 символов.');
			return false;
		}

		if (!/^[a-zA-Z0-9!@#$%^&*()_+]+$/.test(password)) {
			setError('Пароль может содержать только латинские буквы, цифры и специальные символы.');
			return false;
		}

		const phonePattern = /^\d{11}$/;
		if (!phonePattern.test(phone)) {
			setError('Номер телефона должен содержать 11 цифр.');
			return false;
		}

		setError('');
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const response = await fetch('api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password, phone }),
			});

			const data = await response.json();
			if (response.ok) {
				navigate('/login');
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError('Ошибка регистрации. Попробуйте еще раз.');
		}
	};

	return (
		<form name='registerform' onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded shadow-lg w-full max-w-xs mt-5 mx-auto">
			<h2 className="text-2xl mb-4 text-center">Регистрация</h2>
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
			<input
				name='input'
				type="tel"
				placeholder="Номер телефона"
				value={phone}
				onChange={(e) => setPhone(e.target.value)}
				required
				className="border border-gray-300 p-2 mb-4 w-full rounded transition-colors focus:border-blue-500 outline-none"
			/>
			<BlueButton type="submit" otherClasses="p-2 w-full">
				Зарегистрироваться
			</BlueButton>
			<Link to="/login">
				<button type="button" className="mt-2 text-blue-500 hover:underline w-full">
					Войти
				</button>
			</Link>
		</form>
	);
};

export default Register;