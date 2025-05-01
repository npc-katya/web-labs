import React, { useState, useEffect } from "react";
import { loginUser } from "../../api/authService";
import styles from "./LoginPage.module.scss";
import { useNavigate } from "react-router-dom";

// функция для получения токена из куки
const getTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") return value;
  }
  return null;
};

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      navigate("/events");
    }
  }, [navigate]);

  // аутентификация пользователя
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      // Сохраняем токен в куки
      document.cookie = `token=${data.token}; path=/;`;

      setMessage(`добро пожаловать, ${data.name}`);
      window.location.href = "/events";
    } catch (error) {
      console.error("ошибка:", error);
      setMessage("ошибка при входе");
    }
  };

  // регистрация
  const handleRegister = () => {
    window.location.href = "/register";
  };

  // дом
  const handleHome = () => {
    window.location.href = "/";
  };

  return (
    <div>
      <div className={styles.container}>
        <h2>вход</h2>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            войти
          </button>
        </form>

        <h3>ещё не зарегистрированы????</h3>
        <button onClick={handleRegister} className={styles.registerButton}>
          зарегистрироваться
        </button>

        <button onClick={handleHome} className={styles.homeButton}></button>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default LoginForm;
