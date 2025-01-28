const mysql = require('mysql2');

// Настройка подключения к MySQL
const db = mysql.createConnection({
    host: 'junction.proxy.rlwy.net',
    user: 'root',
    password: 'JfjmLKkbtPTdmaoIiKjoKempicHkyiSq',
    database: 'railway',
		port: '54991'
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
