const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Эндпоинт для получения данных пользователя по имени
router.get('/user/:username', (req, res) => {
	const username = req.params.username;

	if (!username) {
		return res.status(400).json({ message: 'Необходима авторизация1' });
	}

	const query = 'SELECT username, taken_jobs, completed_jobs, phone, avatar FROM users where username = ?';
	db.query(query, [username], (err, results) => {
		if (err || results.length === 0) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		res.json(results[0]);
	});
});


// Регистрация пользователя
router.post('/register', async (req, res) => {
	const { username, password, phone } = req.body;

	const checkQuery = 'SELECT * FROM users WHERE username = ? OR phone = ?';

	db.query(checkQuery, [username, phone], async (err, results) => {
		if (err) {
			return res.status(500).json({ message: 'Ошибка при проверке существующих аккаунтов', error: err });
		}

		const errorMessages = [];

		results.forEach(user => {
			if (user.username === username) {
				errorMessages.push('Имя пользователя уже занято');
			}
			if (user.phone === phone) {
				errorMessages.push('Аккаунт с таким номером телефона уже зарегестрирован');
			}
		});

		if (errorMessages.length > 0) {
			return res.status(400).json({ message: errorMessages.join(', ') });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const query = 'INSERT INTO users (username, password, phone) VALUES (?, ?, ?)';
		db.query(query, [username, hashedPassword, phone], (err, result) => {
			if (err) {
				return res.status(500).json({ message: 'Ошибка при регистрации2', error: err });
			}
			res.status(201).json({ id: result.insertId, username });
		});
	});
});


// Авторизация пользователя
router.post('/login', (req, res) => {
	const { username, password } = req.body;

	const query = 'SELECT * FROM users WHERE username = ?';
	db.query(query, [username], async (err, results) => {
		if (err || results.length === 0) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		const user = results[0];
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		const token = jwt.sign({ id: user.id, isAdmin: user.is_admin }, 'secret_key', { expiresIn: '1h' });
		res.json({ token });
	});
});

// Эндпоинт для получения данных текущего пользователя
router.get('/user', (req, res) => {
	const token = req.headers['authorization'];
	if (!token) {
		return res.status(401).json({ message: 'Необходима авторизация' });
	}

	jwt.verify(token, 'secret_key', (err, decoded) => {
		if (err) {
			return res.status(401).json({ message: 'Необходима авторизация' });
		}

		const query = 'SELECT username, completed_jobs, taken_jobs, phone, is_admin, id, avatar FROM users WHERE id = ?';
		db.query(query, [decoded.id], (err, results) => {
			if (err || results.length === 0) {
				return res.status(404).json({ message: 'Пользователь не найден' });
			}
			res.json(results[0]);
		});
	});
});

// Эндпоинт для получения данных другого пользователя по username
router.get('/user/:username', (req, res) => {
	const username = req.params.username;

	const query = 'SELECT * FROM users WHERE username = ?';
	db.query(query, [username], (err, results) => {
		if (err) {
			return res.status(500).json({ message: 'Ошибка базы данных' });
		}
		if (results.length === 0) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		res.json(results[0]);
	});
});

module.exports = router;