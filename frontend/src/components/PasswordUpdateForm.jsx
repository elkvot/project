import React, { useState } from 'react';
import BlueButton from './UI/BlueButton';
import axios from 'axios';

const PasswordUpdateForm = ({ user, refreshProfile, setMessage }) => {
	const [newPassword, setNewPassword] = useState('');
	const [oldPassword, setOldPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`http://localhost:5000/update-password/${user.id}`, {
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