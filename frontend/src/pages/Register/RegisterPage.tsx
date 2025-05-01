import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.scss";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  registerThunk,
  resetRegisterState,
} from "../../features/auth/registerSlice";

type Gender = "male" | "female" | "other" | "not specified";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [gender, setGender] = useState<Gender>("not specified");
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, isError, successMessage } = useAppSelector(
    (state) => state.register,
  );

  // cброс состояния при размонтировании
  useEffect(() => {
    return () => {
      dispatch(resetRegisterState());
    };
  }, [dispatch]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(
      registerThunk({
        name,
        surname,
        patronymic,
        gender,
        dateOfBirth,
        email,
        password,
      }),
    )
      .unwrap()
      .then(() => {
        setTimeout(() => navigate("/login"), 1500);
      });
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
              type="text"
              value={surname}
              placeholder="фамилия"
              onChange={(e) => setSurname(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <input
              type="text"
              value={patronymic}
              placeholder="отчество"
              onChange={(e) => setPatronymic(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              required
              className={styles.input}
            >
              <option value="" disabled>
                выберите пол
              </option>
              <option value="male">мужской</option>
              <option value="female">женский</option>
              <option value="other">другой</option>
              <option value="not specified">не указано</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              name="date"
              value={dateOfBirth.toISOString().split("T")[0]}
              onChange={(e) => setDateOfBirth(new Date(e.target.value))}
              required
              className={styles.modalInput}
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

          <button
            type="submit"
            className={styles.registerButton}
            disabled={isLoading}
          >
            {isLoading ? "регистрируем..." : "зарегистрироваться"}
          </button>
        </form>

        {isError && <p className={styles.message}>ошибка при регистрации</p>}
        {successMessage && <p className={styles.message}>{successMessage}</p>}

        <h3>уже зарегистрированы?</h3>
        <button
          onClick={() => navigate("/login")}
          className={styles.loginButton}
        >
          войти
        </button>
        <button
          onClick={() => navigate("/")}
          className={styles.homeButton}
        ></button>
      </div>
    </div>
  );
};

export default RegisterForm;
