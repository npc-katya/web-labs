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
// функция для валидации данных пользователей
const validateUserData = (data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, userId = null) {
    const { name, email, id, password } = data;
    // проверка на наличие id в запросе
    if (id) {
        return { valid: false, message: "вы не можете задать ID" };
    }
    // проверка обязательных данных для создания
    if (!userId && (!name || !email || !password)) {
        return {
            valid: false,
            message: "укажите все обязательные поля (name, email, password)",
        };
    }
    // проверка типов данных
    if (name && typeof name !== "string") {
        return { valid: false, message: "имя должно быть строкой" };
    }
    if (email && typeof email !== "string") {
        return { valid: false, message: "почта должна быть строкой" };
    }
    if (password && typeof password !== "string") {
        return { valid: false, message: "пароль должен быть строкой" };
    }
    // проверка на изменение запрещённого поля
    if (userId && Object.prototype.hasOwnProperty.call(data, "createdAt")) {
        return { valid: false, message: "изменение времени создания запрещено" };
    }
    // проверка уникальности email
    if (userId) {
        const existingUser = yield User.findOne({ where: { id: userId } });
        if (!existingUser) {
            return { valid: false, message: "пользователь не найден" };
        }
        // для update
        if (data.email && existingUser.email !== data.email) {
            const emailExists = yield User.findOne({ where: { email: data.email } });
            if (emailExists) {
                return {
                    valid: false,
                    message: "пользователь с таким email уже существует",
                };
            }
        }
    }
    else {
        // для create
        const emailExists = yield User.findOne({ where: { email } });
        if (emailExists) {
            return {
                valid: false,
                message: "пользователь с таким email уже существует",
            };
        }
    }
    return { valid: true };
});
// функция для валидации данных мероприятий
const validateEventData = (data, isUpdate = false) => {
    const { title, date, location, createdBy, id } = data;
    // проверка на наличие id в запросе
    if (id) {
        return { valid: false, message: "вы не можете задать ID" };
    }
    // проверка обязательных данных только для создания
    if (!isUpdate && (!title || !date || !location || !createdBy)) {
        return {
            valid: false,
            message: "укажите все обязательные поля (title, date, locaton, createdBy",
        };
    }
    // проверка ID создателя для создания
    if (!isUpdate && createdBy && typeof createdBy !== "number") {
        return { valid: false, message: "ID создателя должен быть числом" };
    }
    // проверка типов данных
    if (title && typeof title !== "string") {
        return { valid: false, message: "название должно быть строкой" };
    }
    if (date && isNaN(Date.parse(date.toString()))) {
        return { valid: false, message: "неверный формат даты (--.--.----)" };
    }
    if (location && typeof location !== "string") {
        return { valid: false, message: "местоположение должно быть строкой" };
    }
    // проверка на изменение запрещённых полей
    if (isUpdate && Object.prototype.hasOwnProperty.call(data, "createdBy")) {
        return { valid: false, message: "изменение ID создателя запрещено" };
    }
    if (isUpdate && Object.prototype.hasOwnProperty.call(data, "createdAt")) {
        return { valid: false, message: "изменение времени создания запрещено" };
    }
    return { valid: true };
};
export { validateUserData, validateEventData };
