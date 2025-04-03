const { User } = require('../models/User');
const { validateUserData } = require('../middleware/validateData');
const { hashPassword } = require('../middleware/hashPassword');


// Create
const createUser = async (req, res) => {

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
            password: hashedPassword
        });

        // ответ
        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt
        };
        res.status(201).json(userResponse);

    } catch (error) {
        res.status(400).json({ error: 'ошибка при создании пользователя', details: error.message });
    }
};

// Get
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при получении пользователей', details: error.message });
    }
};

// Get by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'пользователь не найден' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'ошибка при получении пользователя', details: error.message });
    }
};

// Update
const updateUser = async (req, res) => {

    const userData = req.body;
    const userId = req.params.id;

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
            return res.status(404).json({ error: 'пользователь не найден' });
        }

        // ответ
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(400).json({ error: 'ошибка при обновлении пользователя', details: error.message });
    }
};

// Delete
const deleteUser = async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) {
            return res.status(404).json({ error: 'пользователь не найден' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(400).json({ error: 'ошибка при удалении пользователя', details: error.message });
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};