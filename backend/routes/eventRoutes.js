const express = require('express');
const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');

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
 *   name: Events
 *   description: Управление событиями
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое событие
 *     description: Создает новое событие с указанными данными
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Событие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка валидации или создания события
 */
router.post('/events', createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     description: Возвращает список всех мероприятий
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Ошибка при получении мероприятий
 */
router.get('/events', getEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     description: Возвращает мероприятие по его ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Успешный запрос
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка при получении мероприятия
 */
router.get('/events/:id', getEventById);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить мероприятия по ID
 *     description: Обновляет данные мероприятия по его ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка валидации или обновления мероприятия
 */
router.put('/events/:id', checkTrustedOrigin, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие по ID
 *     description: Удаляет мероприятие по его ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID мероприятия
 *     responses:
 *       204:
 *         description: Мероприятие успешно удалено
 *       404:
 *         description: Мероприятие не найдено
 *       400:
 *         description: Ошибка при удалении мероприятия
 */
router.delete('/events/:id', checkTrustedOrigin, deleteEvent);

module.exports = router;