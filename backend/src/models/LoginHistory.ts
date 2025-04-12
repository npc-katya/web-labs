import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/db";
import User from "./User.js";

interface LoginHistoryAttributes {
  id: number;
  userId: number;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

class LoginHistory
  extends Model<LoginHistoryAttributes>
  implements LoginHistoryAttributes
{
  declare id: number;
  declare userId: number;
  declare ipAddress: string;
  declare userAgent: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // синхронизация модели с базой данных
  static async syncModel() {
    try {
      await this.sync();
      console.log('таблица "login_history" успешно синхронизирована.');
    } catch (error) {
      console.error('ошибка при синхронизации таблицы "login_history":', error);
    }
  }
}

LoginHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "LoginHistory",
    tableName: "login_history",
  },
);

export default LoginHistory;
