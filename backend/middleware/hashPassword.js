const bcrypt = require('bcryptjs');
const saltRounds = 10;

// хеширование пароля
const hashPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plainPassword, salt);
  } catch (error) {
    throw new Error('ошибка при хешировании пароля');
  }
};

module.exports = {
  hashPassword
};