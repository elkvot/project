const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Функция для проверки старого пароля
const verifyOldPassword = (oldPassword, hashedPassword) => {
	return bcrypt.compareSync(oldPassword, hashedPassword);
};

// Эндпоинт для обновления пароля
router.post('/update-password/:id', (req, res) => {
	const { password, oldPassword } = req.body;

	const userId = req.params.id;

	db.query('SELECT password FROM users WHERE id = ?', [userId], (err, results) => {
		if (err) return res.status(500).send('Ошибка базы данных');
		if (results.length === 0) return res.status(404).send('Пользователь не найден');

		const hashedPassword = results[0].password;

		if (!verifyOldPassword(oldPassword, hashedPassword)) {
			return res.status(401).send('Неверный пароль');
		}

		const newHashedPassword = bcrypt.hashSync(password, 10);

		db.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, userId], (err) => {
			if (err) return res.status(500).send('Ошибка обновления пароля');
			res.send('Пароль успешно обновлен');
		});
	});
});

// Эндпоинт для обновления телефона
router.post('/update-phone/:id', (req, res) => {
	const { phone, oldPassword } = req.body;

	const userId = req.params.id;

	db.query('SELECT password FROM users WHERE id = ?', [userId], (err, results) => {
		if (err) return res.status(500).send('Ошибка базы данных');
		if (results.length === 0) return res.status(404).send('Пользователь не найден');

		const hashedPassword = results[0].password;

		if (!verifyOldPassword(oldPassword, hashedPassword)) {
			return res.status(401).send('Неверный пароль');
		}

		db.query('UPDATE users SET phone = ? WHERE id = ?', [phone, userId], (err) => {
			if (err) return res.status(500).send('Ошибка обновления телефона');
			res.send('Телефон успешно обновлен');
		});
	});
});

module.exports = router;