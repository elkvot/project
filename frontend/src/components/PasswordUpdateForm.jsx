import React, { useState } from 'react';
import BlueButton from './UI/BlueButton';
import axios from 'axios';

const PasswordUpdateForm = ({ user, refreshProfile, setMessage }) => {
	const [newPassword, setNewPassword] = useState('');
	const [oldPassword, setOldPassword] = useState('');
	const [error, setError] = useState('');

	const validateForm = () => {
		// Проверка на минимальную длину нового пароля
		if (newPassword.length < 6) {
			setError('Новый пароль должен содержать не менее 6 символов.');
			return false;
		}

		// Проверка на латинские буквы и цифры в новом пароле
		const passwordRegex = /^[a-zA-Z0-9]+$/; // Пароль должен содержать только латинские буквы и цифры
		if (!passwordRegex.test(newPassword)) {
			setError('Новый пароль должен содержать только латинские буквы и цифры.');
			return false;
		}

		// Проверка на минимальную длину старого пароля
		if (oldPassword.length < 6) {
			setError('Старый пароль должен содержать не менее 6 символов.');
			return false;
		}

		setError('');
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		try {
			const response = await axios.post(`api/update-password/${user.id}`, {
				password: newPassword,
				oldPassword,
			});
			setMessage(response.data);
			refreshProfile();
		} catch (error) {
			setMessage(error.response?.data?.message || 'Ошибка обновления пароля');
		}
	};

	return (
		<form name='updatepassword' onSubmit={handleSubmit} className="mb-6">
			<h3 className="text-lg font-semibold mb-2">Изменить пароль</h3>
			{error && <p className="text-red-500 mb-2">{error}</p>}
			<input
				name='input'
				type="password"
				value={newPassword}
				onChange={(e) => setNewPassword(e.target.value)}
				placeholder="Новый пароль"
				className="border border-gray-300 p-2 rounded mb-2 w-full transition-colors focus:border-blue-500 outline-none"
				required
			/>
			<input
				name='input'
				type="password"
				value={oldPassword}
				onChange={(e) => setOldPassword(e.target.value)}
				placeholder="Старый пароль"
				className="border border-gray-300 p-2 rounded mb-2 w-full transition-colors focus:border-blue-500 outline-none"
				required
			/>
			<BlueButton type="submit">Изменить пароль</BlueButton>
		</form>
	);
};

export default PasswordUpdateForm;
