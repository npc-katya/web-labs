import Event from "@models/Event";
import User from "@models/User";
import { validateEventData } from "@middleware/validateData";
import { Request, Response } from "express";

// Create
const createEvent = async (req: Request, res: Response) => {
  // валидация данных
  const validation = validateEventData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  const { createdBy } = req.body;

  try {
    // проверка существования пользователя
    const existingUser = await User.findOne({ where: { id: createdBy } });
    if (!existingUser) {
      return res.status(404).json({ message: "пользователя не существует" });
    }

    // создание события
    const eventData = req.body;
    const newEvent = await Event.create(eventData);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при создании мероприятия",
      details: (error as Error).message,
    });
  }
};

// Get
const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при получении мероприятий",
      details: (error as Error).message,
    });
  }
};

// Get by ID
const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "мероприятие не найдено" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при получении мероприятия",
      details: (error as Error).message,
    });
  }
};

// Update
const updateEvent = async (req: Request, res: Response) => {
  // валидация данных
  const validation = validateEventData(req.body, true);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  // обновление мороприятия
  try {
    const [updated] = await Event.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: "мероприятие не найдено" });
    }
    const updatedEvent = await Event.findByPk(req.params.id);
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при обновлении мероприятия",
      details: (error as Error).message,
    });
  }
};

// Delete
const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "мероприятие не найдено" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(400).json({
      error: "ошибка при удалении мероприятия",
      details: (error as Error).message,
    });
  }
};

export { createEvent, getEvents, getEventById, updateEvent, deleteEvent };
