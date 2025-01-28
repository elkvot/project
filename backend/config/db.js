const mysql = require('mysql2');

// Настройка подключения к MySQL
const db = mysql.createConnection({
    host: 'localhost', // изменить под себя
    user: 'root', // изменить под себя
    password: 'BVCBGFD4242BGFD', // изменить под себя
    database: 'project' // изменить под себя
});

// Подключение к базе данных
db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к MySQL:', err);
        return;
    }
    console.log('Подключено к базе данных MySQL');
});

module.exports = db;
