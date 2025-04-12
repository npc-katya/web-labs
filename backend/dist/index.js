var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { authenticateDB } from "./config/db.js";
import Event from "./models/Event.js";
import User from "./models/User.js";
import LoginHistory from "./models/LoginHistory.js";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { associate } from "./models/associations.js";
import { errorHandler } from "./middleware/errorHandler.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerConfig from "./config/swaggerConfig.js";
import { passport } from "./config/passport.js";
// загрузка конфигурации из .env файла
dotenv.config();
// создание приложения Express
const app = express();
// загрузка переменных из .env
const CORS_ALLOWED_METHODS = process.env.CORS_ALLOWED_METHODS;
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS;
// настройка CORS
const corsOptions = {
    origin: CORS_ALLOWED_ORIGINS.split(","), // только доверенные домены
    methods: CORS_ALLOWED_METHODS.split(","), // только GET и POST
    optionsSuccessStatus: 200,
};
// настройка Middleware
app.use(express.json());
app.use(cors(corsOptions));
// логирование запросов с помощью morgan
app.use(morgan("[:method] :url"));
// обработка некорректных json запросов
app.use(errorHandler);
// инициализация Passport
app.use(passport.initialize());
// маршруты
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/", publicRoutes);
// инициализация Swagger
const swaggerDocs = swaggerJsDoc(swaggerConfig);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// определение порта
const PORT = process.env.PORT;
// тестовый маршрут get
app.get("/", (req, res) => {
    res.json({ message: "мяу мяу мяу мяу..." });
});
// запуск сервера
app.listen(PORT, (err) => __awaiter(void 0, void 0, void 0, function* () {
    if (err) {
        console.error(`ошибка при запуске сервера: ${err.message}`);
        return;
    }
    console.log(`сервер запущен на порту ${PORT}`);
    // проверка соединения с базой данных
    yield authenticateDB();
    // синхронизация моделей
    yield User.syncModel();
    yield Event.syncModel();
    yield LoginHistory.syncModel();
    associate();
}));
