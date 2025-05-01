import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/db";

type Gender = 'male' | 'female' | 'other' | 'not specified';

interface UserAttributes {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  gender: Gender;
  dateOfBirth: Date;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare surname: string;
  declare patronymic: string;
  declare email: string;
  declare gender: Gender;
  declare dateOfBirth: Date;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // синхронизация модели с базой данных
  static async syncModel() {
    try {
      await this.sync();
      console.log('таблица "users" успешно синхронизирована.');
    } catch (error) {
      console.error('ошибка при синхронизации таблицы "users":', error);
    }
  }
}

// структура модели
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true, // первичный ключ
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patronymic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'not specified'),
      allowNull: false,
      defaultValue: 'not specified',
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: "User",
    tableName: "users",
  },
);

export default User;
