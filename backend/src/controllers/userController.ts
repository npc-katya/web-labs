import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import Event from "../models/Event.js";
import { validateUserData } from "../middleware/validateData.js";
import { hashPassword } from "../middleware/hashPassword.js";
import { sequelize } from "../config/db.js";
import { Request, Response } from "express";

interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Create
const createUser = async (req: Request, res: Response) => {
  // валидация данных
  const validation = await validateUserData(req.body);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  // хеширование пароля
  const hashedPassword = await hashPassword(req.body.password);

  try {
    // Создание пользователя
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // ответ
    const userResponse: UserResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при создании пользователя",
      details: (error as Error).message,
    });
  }
};

// Get
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при получении пользователей",
      details: (error as Error).message,
    });
  }
};

// Get by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "пользователь не найден" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при получении пользователя",
      details: (error as Error).message,
    });
  }
};

// Update
const updateUser = async (req: Request, res: Response) => {
  const userData = req.body;
  const userId = Number(req.params.id);

  // валидация данных
  const validation = await validateUserData(req.body, userId);
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const updateData = { ...userData };

    // хеширование пароля, если он был изменен
    if (userData.password) {
      updateData.password = await hashPassword(userData.password);
    }

    // обновление пользователя
    const [updated] = await User.update(updateData, {
      where: { id: userId },
    });
    if (!updated) {
      return res.status(404).json({ error: "пользователь не найден" });
    }

    // ответ
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({
      error: "ошибка при обновлении пользователя",
      details: (error as Error).message,
    });
  }
};

// Delete
const deleteUser = async (req: Request, res: Response) => {
  try {
    const transaction = await sequelize.transaction();

    // удаление связанных записей из таблицы events
    await Event.destroy({
      where: { createdBy: req.params.id },
      transaction,
    });

    // удаление связанных записей из таблицы login_history
    await LoginHistory.destroy({
      where: { userId: req.params.id },
      transaction,
    });

    // удаление пользователя
    const deleted = await User.destroy({
      where: { id: req.params.id },
      transaction,
    });

    if (!deleted) {
      await transaction.rollback();
      return res.status(404).json({ error: "пользователь не найден" });
    }
    await transaction.commit();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({
      error: "ошибка при удалении пользователя",
      details: (error as Error).message,
    });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };
