var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import { validateUserData } from "../middleware/validateData.js";
import { hashPassword } from "../middleware/hashPassword.js";
const { EMAIL_FROM, EMAIL_PASSWORD } = process.env;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD,
    },
});
// проверка на наличие JWT_SECRET
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET не найден");
}
const JWT_SECRET = process.env.JWT_SECRET;
dotenv.config();
// регистрация
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // валидация данных
    const validation = yield validateUserData(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }
    // хеширование пароля
    const hashedPassword = yield hashPassword(req.body.password);
    try {
        // создание пользователя
        const newUser = yield User.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
        res
            .status(201)
            .json({ message: "регистрация успешна", user: newUser.name });
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при создании пользователя",
            details: error.message,
        });
    }
});
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: EMAIL_FROM,
        to,
        subject,
        text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        }
        else {
            console.log("Email sent:", info.response);
        }
    });
};
// аутентификация
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const ipAddress = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    try {
        // поиск пользователя по email
        const user = yield User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "неверный email или пароль" });
        }
        // проверка пароля
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "неверный email или пароль" });
        }
        const lastLogins = yield LoginHistory.findAll({
            where: { userId: Number(user.id) },
            order: [["createdAt", "DESC"]],
            limit: 5,
        });
        const isNewDevice = !lastLogins.some((login) => login.ipAddress === ipAddress && login.userAgent === userAgent);
        if (isNewDevice) {
            sendEmail(user.email, "новый вход в аккаунт", `обнаружен новый вход в ваш аккаунт с IP: ${ipAddress} и User-Agent: ${userAgent}.`);
        }
        const loginHistoryData = {
            userId: user.id,
            ipAddress,
            userAgent,
            id: req.body.id,
            createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
            updatedAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
        };
        yield LoginHistory.create(loginHistoryData);
        // генерация JWT-токена
        const token = jwt.sign({ id: Number(user.id) }, JWT_SECRET, { expiresIn: "1h" });
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        res.json({ token, user: userData.name });
    }
    catch (err) {
        res
            .status(500)
            .json({ error: "ошибка при входе", details: err.message });
    }
});
export { register, login };
