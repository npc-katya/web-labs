import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import { authenticateDB } from "@config/db";
import Event from "@models/Event";
import User from "@models/User";
import LoginHistory from "@models/LoginHistory";
import authRoutes from "@routes/auth";
import protectedRoutes from "@routes/protectedRoutes";
import publicRoutes from "@routes/publicRoutes";

import { associate } from "@models/associations";
import { errorHandler } from "@middleware/errorHandler";

import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import swaggerConfig from "@config/swaggerConfig";
import { passport } from "@config/passport";

// загрузка конфигурации из .env файла
dotenv.config();

// создание приложения Express
const app = express();

// загрузка переменных из .env
const CORS_ALLOWED_METHODS = process.env.CORS_ALLOWED_METHODS as string;
const CORS_ALLOWED_ORIGINS = process.env.CORS_ALLOWED_ORIGINS as string;

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
app.use(errorHandler as express.ErrorRequestHandler);

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
