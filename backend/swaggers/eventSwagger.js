/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление событиями
 */

/**
 * @swagger
 * /protected/events:
 *   post:
 *     summary: Создать новое событие
 *     description: Создает новое событие с указанными данными
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
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

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить список всех мероприятий
 *     description: Возвращает список всех мероприятий
 *     tags: [Events]
 *     security: []
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

/**
 * @swagger
 * /protected/events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     description: Возвращает мероприятие по его ID
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
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

/**
 * @swagger
 * /protected/events/{id}:
 *   put:
 *     summary: Обновить мероприятия по ID
 *     description: Обновляет данные мероприятия по его ID
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
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

/**
 * @swagger
 * /protected/events/{id}:
 *   delete:
 *     summary: Удалить мероприятие по ID
 *     description: Удаляет мероприятие по его ID
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
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