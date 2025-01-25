import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getCreateTime from '../functions/getCreateTime';
import { Link } from 'react-router-dom';
import BlueButton from '../components/UI/BlueButton';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';
import axios from 'axios';

const PostDetail = () => {
	const { id } = useParams();
	const { user } = useAuth();
	const [post, setPost] = useState({});
	const [performerData, setPerformerData] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({ title: '', body: '' });
	const createTime = getCreateTime(post.created_at);
	const [profileData, profileLoading, profileError, refresh] = useProfile(user);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const response = await fetch(`http://localhost:5000/api/getpost/${id}`);
				if (!response.ok) {
					throw new Error('Ошибка при получении поста.');
				}
				const data = await response.json();
				setPost(data);
				setFormData({ title: data.title, body: data.body });
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		const fetchPerformerData = async () => {
			try {
				const response = await fetch(`http://localhost:5000/api/user/${post.performer}`);
				if (!response.ok) {
					throw new Error('Ошибка при получении данных пользователя.');
				}
				const data = await response.json();
				setPerformerData(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
		if (post.performer) {
			fetchPerformerData();
		}
	}, [id, post.performer]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`http://localhost:5000/api/updatepost/${id}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ ...formData, id }),
			});

			if (!response.ok) {
				throw new Error('Ошибка при обновлении поста.');
			}
			const updatedPost = await response.json();
			setPost(updatedPost);
			window.location.reload();
		} catch (err) {
			setError(err.message);
		}
	};

	const deletePost = async (postId) => {
		try {
			const response = await fetch(`http://localhost:5000/api/deletepost/${postId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				navigate('/admin');
			} else {
				console.error('Ошибка при удалении поста');
			}
		} catch (error) {
			console.error('Ошибка при удалении поста:', error);
		}
	};
	const takePost = async (postId) => {
		try {
			const response = await axios.post(`http://localhost:5000/api/takepost`, { postId, username: profileData.username });
			if (response.status === 200) {
				await refresh();
				navigate('/myprofile');
			}
		} catch (error) {
			alert('Сначала авторизуйтесь!');
		}
	};
	const completePost = async (postId) => {
		try {
			const response = await axios.post(`http://localhost:5000/api/completework`, { postId, username: post.performer });
			if (response.status === 200) {
				navigate('/admin');
			}
		} catch (error) {
			alert('Сначала авторизуйтесь!');
		}
	}

	if (loading) {
		return <div className="text-center">Загрузка...</div>;
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	if (!post) {
		return <div>Пост не найден.</div>;
	}

	return (
		<div className="container mx-auto p-4 break-words">
			<div className='mb-4'>
				<h1 className="text-2xl font-bold mb-2">{post.title}</h1>
				<h2 className="text-lg text-gray-600">ID: {post.id}</h2>
				{post.performer ? <Link to={'/profile/' + post.performer} className="text-lg text-gray-600 hover:text-blue-500 transition-colors">Пользователь, выполняющий работу: {post.performer} </Link> : null}
			</div>
			<p className="mb-4 break-words">{post.body}</p>
			<p className="text-sm text-gray-500">Дата и время создания: {createTime}</p>

			{profileData.is_admin ? (
				<div>
					<h3 className="text-xl font-semibold mt-6 mb-2">Редактировать пост</h3>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="title" className="block text-sm font-medium">Заголовок:</label>
							<textarea
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								className="mt-1 block w-full border border-gray-300 rounded-md p-2 resize-none h-30 transition-colors focus:border-blue-500 outline-none"
							/>
						</div>
						<div>
							<label htmlFor="body" className="block text-sm font-medium">Содержимое:</label>
							<textarea
								id="body"
								name="body"
								value={formData.body}
								onChange={handleChange}
								className="mt-1 block w-full border border-gray-300 rounded-md p-2 resize-none h-40 transition-colors focus:border-blue-500 outline-none"
							/>
						</div>
						<BlueButton otherClasses='w-full' type='submit'>Сохранить изменения</BlueButton>
					</form>
				</div>) : null}
			{profileData.is_admin ? <BlueButton otherClasses='mt-2 w-full' onClick={() => deletePost(id)}>Удалить</BlueButton> : null}
			{!profileData.is_admin && (post.performer === null) ? <BlueButton onClick={() => takePost(id)} otherClasses={'mt-3 w-full'}>Принять заказ</BlueButton> : null}
			{profileData.is_admin && (post.performer !== null) ? <BlueButton onClick={() => completePost()} otherClasses={'mt-3 w-full'}>Работа выполнена</BlueButton> : null}
		</div >
	);
};

export default PostDetail;