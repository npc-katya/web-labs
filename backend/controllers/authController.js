const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models/User');
const { LoginHistory } = require('../models/LoginHistory');
const { validateUserData } = require('../middleware/validateData');
const { hashPassword } = require('../middleware/hashPassword');

const {EMAIL_FROM, EMAIL_PASSWORD } = process.env;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD, 
    },
});



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

const sendEmail = (to, subject, text) => {
  const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject,
      text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
};


// аутентификация
const login = async (req, res) => {
    const { email, password } = req.body;
    const ipAddress = req.ip; 
    const userAgent = req.headers['user-agent'];
  
    try {
      // поиск пользователя по email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        //await LoginHistoryService.recordLogin(-1, req, false);
        return res.status(401).json({ error: 'неверный email или пароль' });
      }
  
      // проверка пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        //await LoginHistoryService.recordLogin(user.id, req, false);
        return res.status(401).json({ error: 'неверный email или пароль' });
      }

      const lastLogins = await LoginHistory.findAll({
        where: { userId: user.id },
        order: [['createdAt', 'DESC']],
        limit: 5,
    });

    const isNewDevice = !lastLogins.some(
        (login) => login.ipAddress === ipAddress && login.userAgent === userAgent
    );

    if (isNewDevice) {
        sendEmail(
            user.email, 
            'новый вход в аккаунт',
            `обнаружен новый вход в ваш аккаунт с IP: ${ipAddress} и User-Agent: ${userAgent}.`
        );
    }
    await LoginHistory.create({
        userId: user.id,
        ipAddress,
        userAgent,
    });

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

  getLoginHistory = async (req, res) => {
    try {
        const history = await LoginHistoryService.getUserLoginHistory(req.user.id);
        res.json({ history });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении истории входов' });
    }
};

  module.exports = {
    register,
    login
};