const mysql = require('mysql2');

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

module.exports = db;
