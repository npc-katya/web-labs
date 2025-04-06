module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event and User API',
      version: '1.0.0',
      description: 'API для управления событиями и пользователями',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Локальный сервер',
      },
      {
        url: 'https://api.your-production.com',
        description: 'Продуктивный сервер'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Для авторизации используйте JWT токен в формате: Bearer <ваш_токен>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID пользователя',
              readOnly: true,
              example: 1
            },
            name: {
              type: 'string',
              description: 'Имя пользователя',
              example: 'Иван Иванов'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'Пароль пользователя',
              writeOnly: true,
              minLength: 8,
              example: 'securePassword123'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
              readOnly: true
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
              readOnly: true
            },
          }
        },
        Event: {
          type: 'object',
          required: ['title', 'date'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID события',
              readOnly: true,
              example: 1
            },
            title: {
              type: 'string',
              description: 'Название события',
              example: 'Конференция'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Дата события',
              example: '2023-12-31T20:00:00Z'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата создания',
              readOnly: true
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Дата обновления',
              readOnly: true
            },
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Неавторизованный доступ',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              },
              example: {
                message: "Требуется авторизация"
              }
            }
          }
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./swaggers/*.js']
};