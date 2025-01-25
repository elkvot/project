const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Настройка CORS
app.use(cors());

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Настройка подключения к MySQL
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'BVCBGFD4242BGFD',
	database: 'project'
});

// Подключение к базе данных
db.connect((err) => {
	if (err) {
		console.error('Ошибка подключения к MySQL:', err);
		return;
	}
	console.log('Подключено к базе данных MySQL');
});

// Эндпоинт для создания поста
app.post('/api/createpost', (req, res) => {
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
app.get('/api/getposts', (req, res) => {
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
app.get('/api/getpost/:id', (req, res) => {
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
app.get('/api/getmyposts/:username', (req, res) => {
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
app.delete('/api/deletepost/:id', (req, res) => {
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

// Эндпоинт для получения данных пользователя по имени
app.get('/api/user/:username', (req, res) => {
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
app.post('/api/register', async (req, res) => {
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
app.post('/api/login', (req, res) => {
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
app.get('/api/user', (req, res) => {
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
app.get('/api/user/:username', (req, res) => {
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

// Функция для проверки старого пароля
const verifyOldPassword = (oldPassword, hashedPassword) => {
	return bcrypt.compareSync(oldPassword, hashedPassword);
};

// Эндпоинт для обновления пароля
app.post('/update-password/:id', (req, res) => {
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
app.post('/update-phone/:id', (req, res) => {
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

// Эндпоинт для получения всех принятых постов
app.get('/api/getacceptedposts', (req, res) => {
	const query = 'SELECT * FROM posts WHERE performer IS NOT NULL';
	db.query(query, (err, results) => {
		if (err) {
			res.status(500).json({ message: 'Ошибка при получении постов', error: err });
			return;
		}
		res.status(200).json(results);
	});
});

// Эндпоинт для выполнения работы
app.post('/api/completework', (req, res) => {
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
app.post('/api/takepost', (req, res) => {
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

// Эндпоинт для обновления поста
app.post('/api/updatepost/:id', (req, res) => {
	const { id } = req.params;
	const { title, body } = req.body;

	db.query('UPDATE posts SET title = ?, body = ? WHERE id = ?', [title, body, id], (err) => {

		if (err) return res.status(500).send('Ошибка.');
		res.json('Успешно');
	});
});

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
	}
});

const upload = multer({ storage });

// Эндпоинт для загрузки аватарки
app.post('/api/upload-avatar/:id', upload.single('avatar'), (req, res) => {
	const userId = req.params.id;
	const avatarPath = req.file.path;

	db.query('SELECT avatar FROM users WHERE id = ?', [userId], (err, results) => {
		if (err) {
			return res.status(500).send('Ошибка при получении старой аватарки');
		}

		if (results.length > 0) {
			const oldAvatarPath = results[0].avatar;

			if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
				fs.unlink(oldAvatarPath, (err) => {
					if (err) {
						console.error('Ошибка при удалении старой аватарки:', err);
					}
				});
			}
		}

		db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, userId], (err) => {
			if (err) {
				return res.status(500).send('Ошибка обновления аватарки');
			}
			res.send('Аватарка успешно обновлена');
		});
	});
});

// Хранилище для аватарок
app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Сервер работает на порту ${PORT}`);
});