const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./config/db');
const posts = require('./routes/posts');
const users = require('./routes/users');
const changeProfileData = require('./routes/changeProfileData');

const app = express();

// Настройка CORS
app.use(cors());

// Middleware для парсинга JSON
app.use(bodyParser.json());

app.use('/api', posts);
app.use('/api', users);
app.use('/api', changeProfileData);

app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// // Настройка хранилища для загрузки файлов
// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'uploads/');
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`);
// 	}
// });

// const upload = multer({ storage });

// // Эндпоинт для загрузки аватарки
// app.post('/api/upload-avatar/:id', upload.single('avatar'), (req, res) => {
// 	const userId = req.params.id;
// 	const avatarPath = req.file.path;

// 	db.query('SELECT avatar FROM users WHERE id = ?', [userId], (err, results) => {
// 		if (err) {
// 			return res.status(500).send('Ошибка при получении старой аватарки');
// 		}

// 		if (results.length > 0) {
// 			const oldAvatarPath = results[0].avatar;

// 			if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
// 				fs.unlink(oldAvatarPath, (err) => {
// 					if (err) {
// 						console.error('Ошибка при удалении старой аватарки:', err);
// 					}
// 				});
// 			}
// 		}

// 		db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, userId], (err) => {
// 			if (err) {
// 				return res.status(500).send('Ошибка обновления аватарки');
// 			}
// 			res.send('Аватарка успешно обновлена');
// 		});
// 	});
// });

// // Хранилище для аватарок
// app.use('/uploads/', express.static(path.join(__dirname, 'uploads')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Сервер работает на порту ${PORT}`);
});