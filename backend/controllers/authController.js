const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/User');
const { validateUserData } = require('../middleware/validateData');
const { hashPassword } = require('../middleware/hashPassword');

dotenv.config();

// регистрация
const register = async (req, res) => {

  // валидация данных
  const validation = await validateUserData(req.body);
  if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
  }

  // хеширование пароля
  const hashedPassword = await hashPassword(req.body.password);

  try {
    // создание пользователя
    const newUser = await User.create({
        ...req.body,
        password: hashedPassword
    });
    res.status(201).json( {message: "регистрация успешна", user: newUser.name});

} catch (error) {
    res.status(400).json({ error: 'ошибка при создании пользователя', details: error.message });
}
};


// аутентификация
const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // поиск пользователя по email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'неверный email или пароль' });
      }
  
      // проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'неверный email или пароль' });
      }
  
      // генерация JWT-токена
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
  
      res.json({ token, user: userData.name });
    } catch (err) {
      res.status(500).json({ error: 'ошибка при входе', details: err.message });
    }
  };

  module.exports = {
    register,
    login
};