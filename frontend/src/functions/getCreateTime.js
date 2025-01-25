export default function getCreateTime(unixTime) {
	if (!unixTime || typeof unixTime !== 'number') {
		return 'Неверная дата';
	}
	return new Date(unixTime * 1000).toLocaleString();
}
