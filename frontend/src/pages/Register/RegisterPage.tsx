import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import { registerUser } from "../../api/authService";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // регистрация пользователя
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await registerUser(name, email, password);
      setMessage(`пользователь зарегистрирован: ${data.name}`);

      setTimeout(() => {
        navigate("/login");
      });
    } catch (error) {
      console.error("ошибка:", error);
      setMessage("ошибка при регистрации");
    }
  };

  // вход
  const handleLogin = () => {
    navigate("/login");
  };

  // дом
  const handleHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className={styles.container}>
        <h2>регистрация</h2>
        <form onSubmit={handleRegister}>
          <div>
            <input
              type="text"
              value={name}
              placeholder="имя"
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              placeholder="почта"
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="пароль"
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            зарегистрироваться
          </button>
        </form>

        <h3>уже зарегистрированы?</h3>

        <button onClick={handleLogin} className={styles.loginButton}>
          войти
        </button>

        <button onClick={handleHome} className={styles.homeButton}></button>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default RegisterForm;
