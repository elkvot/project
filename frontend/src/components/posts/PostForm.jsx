import React, { useState } from 'react';
import BlueButton from '../../components/UI/BlueButton';
import Modal from '../../components/UI/Modal';
import Notification from '../../components/UI/Notification';

const PostForm = () => {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [notification, setNotification] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		const postData = {
			title,
			body,
		};

		try {
			const response = await fetch('http://localhost:5000/api/createpost/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(postData),
			});

			if (!response.ok) {
				console.log('Ошибка фетчинга');
				return;
			}

			const result = await response.json();
			console.log('Пост создан:', result);

			setNotification('Пост успешно создан!');
			setTimeout(() => setNotification(''), 3000);

			setTitle('');
			setBody('');
			setIsOpen(false);
		} catch (error) {
			console.error('Ошибка:', error);
		}
	};

	return (
		<div>
			<BlueButton onClick={() => setIsOpen(true)}>Создать пост</BlueButton>

			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
				<form name='postform' onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block mb-1">
							Заголовок:
							<input
								name='input'
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								className="border-2 border-gray-300 p-2 w-full transition-colors focus:border-blue-500 outline-none"
							/>
						</label>
					</div>
					<div className="mb-4">
						<label className="block mb-1">
							Тело поста:
							<textarea
								name='textarea'
								value={body}
								onChange={(e) => setBody(e.target.value)}
								required
								style={{ height: 200 }}
								className="border-2 border-gray-300 p-2 w-full resize-none transition-colors focus:border-blue-500 outline-none"
							/>
						</label>
					</div>
					<div className="flex justify-between">
						<BlueButton name='input' type="submit">
							Создать пост
						</BlueButton>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="bg-gray-300 text-black px-4 py-2 rounded transition-opacity hover:opacity-80"
						>
							Отмена
						</button>
					</div>
				</form>
			</Modal>

			<Notification message={notification} />
		</div>
	);
};

export default PostForm;