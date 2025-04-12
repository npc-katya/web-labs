import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

// загрузка конфигурации из .env
dotenv.config();


// проверка обязательных переменных окружения
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_DIALECT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Необходимо указать ${envVar} в .env файле`);
  }
}

// типизация диалекта
type Dialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2';

// создание экземпляра Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT as Dialect,
    logging: process.env.DB_LOGGING === 'true',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// функция для проверки соединения
const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("соединение с базой данных успешно установлено.");
  } catch (error) {
    console.error("не удалось подключиться к базе данных:", error);
  }
};

export { sequelize, authenticateDB };
