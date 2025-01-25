const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Импортируем подключение к базе данных

// Эндпоинт для создания поста
router.post('/createpost', (req, res) => {
    const { title, body } = req.body;
    const createTime = Math.floor(Date.now() / 1000);

    const query = 'INSERT INTO posts (title, body, created_at) VALUES (?, ?, ?)';
    db.query(query, [title, body, createTime], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Ошибка при создании поста', error: err });
            return;
        }
        res.status(201).json({ id: result.insertId, title, body, created_at: createTime });
    });
});

// Эндпоинт для получения всех постов
router.get('/getposts', (req, res) => {
	const query = 'SELECT * FROM posts WHERE performer IS NULL';
	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при получении постов', error: err });
			return;
		}
		res.status(200).json(results);
	});
});

// Эндпоинт для получения поста по id
router.get('/getpost/:id', (req, res) => {
	const postId = req.params.id;
	const query = 'SELECT * FROM posts WHERE id = ?';
	db.query(query, [postId], (err, result) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при получении постов', error: err });
			return;
		}
		if (result.length === 0) {
			res.status(404).json({ message: 'Этого поста не существует, либо он был удален.' });
			return;
		}
		res.status(200).json(result[0]);
	});
});

// Эндпоинт для получения постов, которых взял пользователь
router.get('/getmyposts/:username', (req, res) => {
	const username = req.params.username;
	const query = 'SELECT * FROM posts WHERE performer = ?';

	db.query(query, [username], (err, result) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при получении постов', error: err });
			return;
		}
		if (result.length === 0) {
			res.status(404).json({ message: 'Вы еще не взяли ни одного поста с работой.' });
			return;
		}
		res.status(200).json(result);
	});
});

// Эндпоинт для удаления поста по id
router.delete('/deletepost/:id', (req, res) => {
	const postId = req.params.id;

	const query = 'DELETE FROM posts WHERE id = ?';
	db.query(query, [postId], (err, result) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при удалении поста', error: err });
			return;
		}
		res.status(204).send();
	});
});

// Эндпоинт для выполнения работы
router.post('/completework', (req, res) => {
	const { postId, username } = req.body;
	db.query('DELETE FROM posts WHERE id = ?', [postId], (err, result) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при удалении поста', error: err });
			return;
		}
	});
	db.query('UPDATE users SET completed_jobs = completed_jobs + 1 WHERE username = ?', [username], (err, result) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при выполнении работы', error: err });
			return;
		}
	})
	res.status(200).json({ message: 'Работа выполнена успешно' });
});

// Эндпоинт для взятия работы
router.post('/takepost', (req, res) => {
	const { postId, username } = req.body;

	db.query('UPDATE posts SET performer = ? WHERE id = ?', [username, postId], (error, results) => {
		if (error) {
			return res.status(500).json({ message: "Внутренняя ошибка сервера." });
		}

		if (results.affectedRows === 0) {
			return res.status(404).json({ message: "Пост не найден или уже взят." });
		}
		db.query('UPDATE users SET taken_jobs = taken_jobs + 1 WHERE username = ?', [username], (err) => {
			if (err) return res.status(500).send('Ошибка');
			res.send('Успешно');
		});
	});
});

// Эндпоинт для получения всех принятых постов
router.get('/getacceptedposts', (req, res) => {
	const query = 'SELECT * FROM posts WHERE performer IS NOT NULL';
	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при получении постов', error: err });
			return;
		}
		res.status(200).json(results);
	});
});

// Эндпоинт для обновления поста
router.post('/updatepost/:id', (req, res) => {
	const { id } = req.params;
	const { title, body } = req.body;

	db.query('UPDATE posts SET title = ?, body = ? WHERE id = ?', [title, body, id], (err) => {

		if (err) return res.status(500).send('Ошибка.');
		res.json('Успешно');
	});
});

module.exports = router;