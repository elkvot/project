import React from 'react';
import { Link } from 'react-router-dom';
import getCreateTime from '../../functions/getCreateTime';

export default function PostItem({ post, onDelete }) {
	const createdAt = getCreateTime(post.created_at);

	return (
		<li key={post.id} className="bg-white shadow-md rounded-lg p-4 mb-4 border-2">
			<Link to={"/posts/" + post.id} className="break-words text-xl font-semibold text-gray-800 hover:text-blue-500 transition-colors">
				{post.title}
			</Link>
			<p className="text-gray-700 mt-2 break-words">{post.body}</p>
			<p className="text-gray-500 text-sm mt-1">Создано: {createdAt}</p>
			{post.performer ? <Link to={'/profile/' + post.performer} className="break-words mb-3 font-semibold text-gray-600 hover:text-blue-500 transition-colors">Пользователь, выполняющий работу: {post.performer} </Link> : <div className='mb-3'></div>}
		</li>
	);
}
