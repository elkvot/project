import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostItem from './PostItem';
import { useAuth } from '../../context/AuthContext';
import useProfile from '../../hooks/useProfile';

const PostList = () => {
	const { user } = useAuth();
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [profileData] = useProfile(user);

	useEffect(() => {
		const fetchPosts = async () => {
			let response
			try {
				response = await axios.get(`api/getmyposts/${profileData.username}`);
				setPosts(response.data);
				setLoading(false);
			} catch (err) {
				setError('Вы еще не взяли ни одного поста');
				setLoading(false);
			}
		};

		if (profileData) {
			fetchPosts();
		}
	}, [profileData]);

	if (loading) return <p>Загрузка постов...</p>;
	if (error) return <h6 className='text-center text-2xl'>{error}</h6>;

	return (
		<div>
			<h1 className='text-center font-semibold text-2xl mb-5'>Список принятых постов с работой</h1>
			<ul>
				{posts.map(post => (
					<PostItem key={post.id} post={post}></PostItem>
				))}
			</ul>
		</div>
	);
};

export default PostList;