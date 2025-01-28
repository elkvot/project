import { React, useState, useEffect } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';
import PostEditableItem from './PostEditableItem';
import MySelect from '../UI/MySelect';

const PostList = ({ isAccepted }) => {
	const { user } = useAuth();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [profileData] = useProfile(user);
	const [selectedSort, setSelectedSort] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = isAccepted
					? await axios.get('api/getacceptedposts/')
					: await axios.get('api/getposts/');
				setPosts(response.data);
			} catch (err) {
				setError('Ошибка загрузки постов');
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [profileData, isAccepted]);

	if (loading) return <p>Загрузка постов...</p>;
	if (error) return <p>{error}</p>;

	const deletePost = async (postId) => {
		try {
			const response = await fetch(`api/deletepost/${postId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setPosts(posts.filter(post => post.id !== postId));
			} else {
				console.error('Ошибка при удалении поста');
			}
		} catch (error) {
			console.error('Ошибка при удалении поста:', error);
		}
	};

	const takePost = async (postId) => {
		try {
			const response = await axios.post(`api/takepost`, { postId, username: profileData.username });
			if (response.status === 200) {
				setPosts(posts.filter(post => post.id !== postId));
				console.log('Работа успешно взята:', response.data);
			}
		} catch (error) {
			alert('Сначала авторизуйтесь!');
		}
	};

	// Функция для фильтрации постов
	const filteredPosts = posts.filter(post => {
		const titleMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
		const bodyMatch = post.body.toLowerCase().includes(searchQuery.toLowerCase());
		return titleMatch || bodyMatch;
	});

	const sortPosts = (sort) => {
		setSelectedSort(sort);
		const sortedPosts = [...filteredPosts].sort((a, b) => {
			if (sort === 'createdAtAsc') {
				return new Date(a.created_at) - new Date(b.created_at); // Сначала давние
			} else if (sort === 'createdAtDesc') {
				return new Date(b.created_at) - new Date(a.created_at); // Сначала новые
			} else {
				return a[sort].localeCompare(b[sort]);
			}
		});
		setPosts(sortedPosts);
	};

	const hasPosts = filteredPosts.length > 0;

	return (
		<div>
			<div className='inline-block'>
				<MySelect
					name='select'
					defaultValue="Сортировка по"
					className='my-2'
					value={selectedSort}
					onChange={sortPosts}
					options={[
						{ value: 'title', name: 'По названию' },
						{ value: 'body', name: 'По описанию' },
						{ value: 'createdAtAsc', name: 'Сначала давние' },
						{ value: 'createdAtDesc', name: 'Сначала новые' },
					]}
				/>
			</div>
			<textarea
				name='textarea'
				type="text"
				placeholder="Поиск по названию или описанию"
				className="border-2 border-gray-300 p-2 w-full resize-none transition-colors focus:border-blue-500 outline-none"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			{isAccepted && hasPosts && (
				<h2 className='text-center mt-2 text-3xl font-medium mb-3'>Список принятых постов</h2>
			)}
			<ul>
				{hasPosts ? (
					filteredPosts.map(post => (
						profileData && profileData.is_admin ? (
							<PostEditableItem key={post.id} post={post} onDelete={deletePost} />
						) : (
							<PostItem key={post.id} post={post} onDelete={deletePost} onTake={takePost} receivable={true} user={user} />
						)
					))
				) : (
					<p className='text-center mt-2 font-semibold'>К сожалению, нет постов для отображения</p>
				)}
			</ul>
		</div>
	);
};

export default PostList;