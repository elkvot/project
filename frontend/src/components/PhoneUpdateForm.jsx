import React, { useState } from 'react';
import BlueButton from './UI/BlueButton';
import axios from 'axios';

const PhoneUpdateForm = ({ user, refreshProfile, setMessage }) => {
	const [newPhone, setNewPhone] = useState('');
	const [oldPassword, setOldPassword] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`http://localhost:5000/update-phone/${user.id}`, {
				phone: newPhone,
				oldPassword,
			});
			setMessage(response.data);
			refreshProfile();
		} catch (error) {
			setMessage(error.response?.data?.message || 'Ошибка обновления номера телефона');
		}
	};

	return (
		<form name='updatephone' onSubmit={handleSubmit} className="mb-6">
			<h3 className="text-lg font-semibold mb-2">Изменить номер телефона</h3>
			<input
				name='input'
				type="tel"
				value={newPhone}
				onChange={(e) => setNewPhone(e.target.value)}
				placeholder="Новый номер телефона"
				className="border border-gray-300 p-2 rounded mb-2 w-full transition-colors focus:border-blue-500 outline-none"
				required
			/>
			<input
				name='input'
				type="password"
				value={oldPassword}
				onChange={(e) => setOldPassword(e.target.value)}
				placeholder="Пароль"
				className="border border-gray-300 p-2 rounded mb-2 w-full transition-colors focus:border-blue-500 outline-none"
				required
			/>
			<BlueButton type="submit">Изменить номер телефона</BlueButton>
		</form>
	);
};

export default PhoneUpdateForm;