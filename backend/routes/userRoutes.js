const express = require('express');
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

const router = express.Router();

// проверка на origin
const checkTrustedOrigin = (req, res, next) => {
    const origin = req.get('origin'); // заголовок Origin
  
    // разрешение запроса если origin отсутствует
    if (!origin) {
      console.warn('заголовок Origin отсутствует. запрос разрешён.');
      return next();
    }
  
    // получение списка доверенных origin из .env
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',');
  
    // проверкана доверенность
    if (allowedOrigins.includes(origin)) {
      console.log(`запрос от доверенного origin: ${origin}`);
      next();
    } else {
      console.warn(`запрос от недоверенного origin: ${origin}`);
      res.status(403).json({ error: 'запрос запрещён' });
    }
  };

// CRUD routes for users

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     description: Создает нового пользователя с указанными данными
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации или создания пользователя
 */
router.post('/users', createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить список всех пользователей
 *     description: Возвращает список всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка при получении пользователей
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     description: Возвращает пользователя по его ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Ошибка при получении пользователя
 */
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Обновить пользователя по ID
 *     description: Обновляет данные пользователя по его ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Пользователь успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Ошибка валидации или обновления пользователя
 */
router.put('/users/:id', checkTrustedOrigin, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Удалить пользователя по ID
 *     description: Удаляет пользователя по его ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь успешно удален
 *       404:
 *         description: Пользователь не найден
 *       400:
 *         description: Ошибка при удалении пользователя
 */
router.delete('/users/:id', checkTrustedOrigin, deleteUser);

module.exports = router;