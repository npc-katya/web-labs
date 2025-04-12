import { Model, DataTypes } from "sequelize";
import { sequelize } from "@config/db";
class User extends Model {
    // синхронизация модели с базой данных
    static async syncModel() {
        try {
            await this.sync();
            console.log('таблица "users" успешно синхронизирована.');
        }
        catch (error) {
            console.error('ошибка при синхронизации таблицы "users":', error);
        }
    }
}
// структура модели
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, // первичный ключ
    },
    name: {
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
    modelName: "User",
    tableName: "users",
});
export default User;
