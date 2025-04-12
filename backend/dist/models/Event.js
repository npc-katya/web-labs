import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/db";
import User from "./User.js";
class Event extends Model {
    // синхронизация модели с базой данных
    static async syncModel() {
        try {
            await this.sync();
            console.log('таблица "events" успешно синхронизирована.');
        }
        catch (error) {
            console.error('ошибка при синхронизации таблицы "events":', error);
        }
    }
}
// структура модели
Event.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, // первичный ключ
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        }, // определение внешнего ключа
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "Event",
    tableName: "events",
});
export default Event;
