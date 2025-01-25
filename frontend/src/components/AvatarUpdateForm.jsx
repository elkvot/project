import React, { useState } from 'react';
import BlueButton from './UI/BlueButton';
import axios from 'axios';

const AvatarUpdateForm = ({ user, refreshProfile, setMessage }) => {
	const [avatar, setAvatar] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('avatar', avatar);

		try {
			await axios.post(`http://localhost:5000/api/upload-avatar/${user.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			setMessage('Аватарка успешно обновлена');
			refreshProfile();
		} catch (error) {
			setMessage(error.response?.data?.message || 'Ошибка загрузки аватарки');
		}
	};

	return (
		<form name='updateavatar' onSubmit={handleSubmit} className="mb-6">
			<h3 className="text-lg font-semibold mb-2">Загрузить аватарку</h3>
			<input
				name='input'
				type="file"
				accept="image/*"
				onChange={(e) => setAvatar(e.target.files[0])}
				className="border border-gray-300 p-2 rounded mb-2"
				required
			/>
			<BlueButton type="submit" otherClasses='ml-2'>Загрузить аватарку</BlueButton>
		</form>
	);
};

export default AvatarUpdateForm;