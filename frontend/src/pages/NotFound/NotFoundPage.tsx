import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>страница не найдена</p>
        <p className={styles.text}>
          возможно, она была удалена или вы ввели неверный адрес
        </p>
        <Link to="/" className={styles.link}>
          вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
