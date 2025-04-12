var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import Event from "../models/Event.js";
import { validateUserData } from "../middleware/validateData.js";
import { hashPassword } from "../middleware/hashPassword.js";
import { sequelize } from "../config/db.js";
// Create
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // валидация данных
    const validation = yield validateUserData(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }
    // хеширование пароля
    const hashedPassword = yield hashPassword(req.body.password);
    try {
        // Создание пользователя
        const newUser = yield User.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
        // ответ
        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
        };
        res.status(201).json(userResponse);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при создании пользователя",
            details: error.message,
        });
    }
});
// Get
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении пользователей",
            details: error.message,
        });
    }
});
// Get by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "пользователь не найден" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении пользователя",
            details: error.message,
        });
    }
});
// Update
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const userId = Number(req.params.id);
    // валидация данных
    const validation = yield validateUserData(req.body, userId);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }
    try {
        const updateData = Object.assign({}, userData);
        // хеширование пароля, если он был изменен
        if (userData.password) {
            updateData.password = yield hashPassword(userData.password);
        }
        // обновление пользователя
        const [updated] = yield User.update(updateData, {
            where: { id: userId },
        });
        if (!updated) {
            return res.status(404).json({ error: "пользователь не найден" });
        }
        // ответ
        const updatedUser = yield User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при обновлении пользователя",
            details: error.message,
        });
    }
});
// Delete
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield sequelize.transaction();
        // удаление связанных записей из таблицы events
        yield Event.destroy({
            where: { createdBy: req.params.id },
            transaction,
        });
        // удаление связанных записей из таблицы login_history
        yield LoginHistory.destroy({
            where: { userId: req.params.id },
            transaction,
        });
        // удаление пользователя
        const deleted = yield User.destroy({
            where: { id: req.params.id },
            transaction,
        });
        if (!deleted) {
            yield transaction.rollback();
            return res.status(404).json({ error: "пользователь не найден" });
        }
        yield transaction.commit();
        res.status(204).json();
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при удалении пользователя",
            details: error.message,
        });
    }
});
export { createUser, getUsers, getUserById, updateUser, deleteUser };
