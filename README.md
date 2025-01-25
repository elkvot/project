# project
<h1>Для запуска проекта необходимо:</h1>
1. Установить на свой компьютер Node.js, npm и mysql (если они еще не установлены)<br>
2. Изменить конфигурацию подключения к mysql в /backend/config/db.js под своего пользователя в mysql<br>
3. Создать sql базу данных, с тем же именем, что указано в конфигурации и две таблицы в ней<br>

Первая таблица: 

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `avatar` varchar(255) DEFAULT NULL,
  `taken_jobs` int NOT NULL DEFAULT '0',
  `completed_jobs` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

Вторая таблица:

CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `created_at` int NOT NULL,
  `performer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

4. Прописать команду 'npm start' в корневой директории проекта.
5. Перейти по адресу localhost:3000
<hr>
<h2>Для создания админа необходимо:</h2>
1. Создать пользователя используя UI веб приложения, а затем выдать пользователю права админа sql-командой<br>
<strong>UPDATE users set is_admin=1 WHERE username='имя пользователя';</strong><br>
2. Перезайти в аккаунт в веб-приложении
