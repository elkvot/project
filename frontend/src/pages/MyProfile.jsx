import React from 'react';
import ProfileCard from '../components/ProfileCard';
import MyPostList from '../components/posts/MyPostList';
import useProfile from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
	const { user } = useAuth();
	const [profileData, loading, error] = useProfile(user);

	if (loading) return <p className="text-center">Loading...</p>;
	if (error) return <p className="text-red-500">Error loading profile: {error.message}</p>;
	if (!profileData) {
		return <p className="text-center">Данные профиля не найдены</p>;
	}
	

	return (
		<div>
			<ProfileCard
				username={profileData.username}
				taken_jobs={profileData.taken_jobs}
				completed_jobs={profileData.completed_jobs}
				phone={profileData.phone}
				is_admin={profileData.is_admin}
				avatar={profileData.avatar}
				editable={true}
			/>

			{profileData.is_admin === 1 ? null : <MyPostList />}
		</div>
	);
};

export default MyProfile;