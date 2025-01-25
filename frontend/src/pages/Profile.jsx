import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';

const Profile = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/user/${username}`);
                setProfileData(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Ошибка загрузки данных');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg text-gray-500">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <p className="text-red-500 text-lg">Ошибка загрузки профиля: {error}</p>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="max-w-md mx-auto mt-8">
                <p className="text-gray-500 text-lg">Профиль не найден</p>
            </div>
        );
    }

    return (
        <ProfileCard username={profileData.username}
							phone={profileData.phone} is_admin={profileData.is_admin} 
							avatar={profileData.avatar} taken_jobs={profileData.taken_jobs} 
							completed_jobs={profileData.completed_jobs} />
    );
};

export default Profile;