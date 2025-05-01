import styles from "./Header.module.scss";
import logo from "../../img/logo.svg";
import userImg from "../../img/user.svg";
import burgerImg from "../../img/burger.svg";
import { UserData } from "../../types/user";

interface HeaderProps {
  userData: UserData;
  setIsLoginModalOpen: (value: boolean) => void;
  setIsBurgerModalOpen: (value: boolean) => void;
  handleHome: () => void;
}

const Header: React.FC<HeaderProps> = ({
  userData,
  setIsLoginModalOpen,
  setIsBurgerModalOpen,
  handleHome,
}) => {
  return (
    <div className={styles.header}>
      {/* логотип */}
      <div className={styles.headerLogo} onClick={handleHome}>
        <img src={logo} alt="логотип" className={styles.logoImage} />
        <p>мяу мяу</p>
      </div>

      {/* пользователь */}
      <div className={styles.user}>
        <div className={styles.userName}>
          {userData.name ? `${userData.name}` : "гость"}
        </div>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className={styles.modalOpen}
        >
          <img src={userImg} alt="профиль" className={styles.modalOpenImage} />
        </button>

        <button
          onClick={() => setIsBurgerModalOpen(true)}
          className={styles.modalOpen}
        >
          <img src={burgerImg} alt="меню" className={styles.modalOpenImage} />
        </button>
      </div>
    </div>
  );
};

export default Header;
