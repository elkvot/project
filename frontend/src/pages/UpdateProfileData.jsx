import {useState, React} from 'react'
import AvatarUpdateForm from '../components/AvatarUpdateForm';
import PhoneUpdateForm from '../components/PhoneUpdateForm';
import PasswordUpdateForm from '../components/PasswordUpdateForm';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';


export default function UpdateProfileData() {
	const { user } = useAuth();
	const [message, setMessage] = useState('');
	const [profileData, loading, error, refreshProfile] = useProfile(user);

	if (loading) return <p className="text-center">Loading...</p>;
	if (error) return <p className="text-red-500">Error loading profile: {error.message}</p>;
	if (!profileData) {
		return <p className="text-center">Данные профиля не найдены</p>;
	}
	return (
		<section>
			<h2 className="text-xl font-semibold mb-4">Изменить профиль</h2>
			{message && <p className="text-green-500 mb-4">{message}</p>}

			<AvatarUpdateForm user={profileData} refreshProfile={refreshProfile} setMessage={setMessage} />

			<PhoneUpdateForm user={profileData} refreshProfile={refreshProfile} setMessage={setMessage} />

			<PasswordUpdateForm user={profileData} refreshProfile={refreshProfile} setMessage={setMessage} />
		</section>
	)
}
