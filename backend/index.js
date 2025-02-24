const express = require('express');
const dotenv = require('dotenv'); // для загрузки из .env
const cors = require('cors');
const { authenticateDB } = require('./config/db');
const Event = require('./models/Event');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { associate } = require('./models/associations');


// загрузка конфигурации из .env файла
dotenv.config();

// создание приложения Express
const app = express();

// настройка Middleware
app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(eventRoutes);

// определение порта
const PORT = process.env.PORT;

// тестовый маршрут get
app.get('/', (req, res) => {
    res.json({ message: 'мяу мяу мяу мяу...' });
});

// запуск сервера
app.listen(PORT, async (err) => {
    if (err) {
        console.error(`ошибка при запуске сервера: ${err.message}`);
        return;
    }
    console.log(`сервер запущен на порту ${PORT}`);
    
    // проверка соединения с базой данных
    await authenticateDB();

    // синхронизация моделей
    await User.syncModel();
    await Event.syncModel();
});