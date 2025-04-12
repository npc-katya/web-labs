const express = require('express');
const dotenv = require('dotenv'); // для загрузки из .env
const cors = require('cors');
const morgan = require('morgan');

const { authenticateDB } = require('./config/db');
const Event = require('./models/Event');
const User = require('./models/User');
const LoginHistory = require('./models/LoginHistory');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
const publicRoutes = require('./routes/publicRoutes');

const { associate } = require('./models/associations');
const errorHandler = require('./middleware/errorHandler');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerConfig = require('./config/swaggerConfig');

const { passport } = require('./config/passport');

// загрузка конфигурации из .env файла
dotenv.config();

// создание приложения Express
const app = express();

// настройка CORS
const corsOptions = {
    origin: process.env.CORS_ALLOWED_ORIGINS.split(','), // только доверенные домены
    methods: process.env.CORS_ALLOWED_METHODS.split(','), // только GET и POST
    optionsSuccessStatus: 200,
};

// настройка Middleware
app.use(express.json());
app.use(cors(corsOptions));

// логирование запросов с помощью morgan
app.use(morgan('[:method] :url'));

// обработка некорректных json запросов
app.use(errorHandler);

// инициализация Passport
app.use(passport.initialize());

// маршруты
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/', publicRoutes);


// инициализация Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
    await LoginHistory.syncModel();
    associate();
});