/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /protected/users:
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

/**
 * @swagger
 * /protected/users:
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

/**
 * @swagger
 * /protected/users/{id}:
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

/**
 * @swagger
 * /protected/users/{id}:
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

/**
 * @swagger
 * /protected/users/{id}:
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