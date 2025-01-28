import { useState, useEffect } from "react";

export default function useProfile(user) {
	const [profileData, setProfileData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchProfileData = async () => {
		if (!user) {
			setLoading(false);
			return;
		}

		try {
			const response = await fetch('api/user', {
				headers: {
					Authorization: `${user.token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setProfileData(data);
				localStorage.setItem(user.id, JSON.stringify(data)); // Сохранение в localStorage
			} else {
				setError('Ошибка при загрузке данных профиля.');
			}
		} catch (err) {
			setError('Ошибка сети. Попробуйте позже.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!user) {
			setProfileData(null);
			setLoading(false);
			return;
		}

		const storedProfileData = localStorage.getItem(user.id);
		if (storedProfileData) {
			setProfileData(JSON.parse(storedProfileData));
			setLoading(false);
		} else {
			fetchProfileData();
		}
	}, [user]);

	const refreshProfile = async () => {
		await fetchProfileData();
	};

	return [profileData, loading, error, refreshProfile];
}
