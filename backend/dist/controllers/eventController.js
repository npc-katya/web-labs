var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Event from "../models/Event.js";
import User from "../models/User.js";
import { validateEventData } from "../middleware/validateData.js";
// Create
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // валидация данных
    const validation = validateEventData(req.body);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }
    const { createdBy } = req.body;
    try {
        // проверка существования пользователя
        const existingUser = yield User.findOne({ where: { id: createdBy } });
        if (!existingUser) {
            return res.status(404).json({ message: "пользователя не существует" });
        }
        // создание события
        const eventData = req.body;
        const newEvent = yield Event.create(eventData);
        res.status(201).json(newEvent);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при создании мероприятия",
            details: error.message,
        });
    }
});
// Get
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event.findAll();
        res.status(200).json(events);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении мероприятий",
            details: error.message,
        });
    }
});
// Get by ID
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Event.findByPk(req.params.id);
        if (!event) {
            return res.status(404).json({ error: "мероприятие не найдено" });
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при получении мероприятия",
            details: error.message,
        });
    }
});
// Update
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // валидация данных
    const validation = validateEventData(req.body, true);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }
    // обновление мороприятия
    try {
        const [updated] = yield Event.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) {
            return res.status(404).json({ error: "мероприятие не найдено" });
        }
        const updatedEvent = yield Event.findByPk(req.params.id);
        res.status(200).json(updatedEvent);
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при обновлении мероприятия",
            details: error.message,
        });
    }
});
// Delete
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield Event.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            return res.status(404).json({ error: "мероприятие не найдено" });
        }
        res.status(204).json();
    }
    catch (error) {
        res.status(400).json({
            error: "ошибка при удалении мероприятия",
            details: error.message,
        });
    }
});
export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
