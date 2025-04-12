const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class LoginHistory extends Model {}

LoginHistory.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'LoginHistory',
    tableName: 'login_history',
    timestamps: true, // включение createdAt и updatedAt
});

// синхронизация модели с базой данных
const syncModel = async () => {
    try {
        await LoginHistory.sync();
        console.log('таблица "login_history" успешно синхронизирована.');
    } catch (error) {
        console.error('ошибка при синхронизации таблицы "login_history":', error);
    }
}

module.exports = { LoginHistory, syncModel };