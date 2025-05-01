import React, { useState, useEffect } from "react";
import styles from "./LoginPage.module.scss";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginThunk } from "../../features/auth/authSlice";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, isError, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/events");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
  };

  return (
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
        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "входим..." : "войти"}
        </button>
      </form>

      {isError && <p className={styles.message}>ошибка при входе</p>}

      <h3>ещё не зарегистрированы????</h3>
      <button
        onClick={() => navigate("/register")}
        className={styles.registerButton}
      >
        зарегистрироваться
      </button>

      <button
        onClick={() => navigate("/")}
        className={styles.homeButton}
      ></button>
    </div>
  );
};

export default LoginForm;
